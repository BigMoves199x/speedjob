import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { randomUUID } from "crypto";
import { sendTelegramNotification } from "@/app/lib/sendTelegramNotification";

// Reuse a single pool across requests
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const first_name = body.first_name?.toString().trim() || "";
    const last_name = body.last_name?.toString().trim() || "";
    const email = body.email?.toString().trim().toLowerCase() || "";
    const phone = body.phone?.toString().trim() || "";
    const resumeUrl = (body.resume_url ?? body.resumeUrl)?.toString().trim() || "";

    if (!first_name || !last_name || !email || !phone || !resumeUrl) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const id = randomUUID();

    // Insert into Supabase Postgres
    const { rows } = await pool.query<{ id: string }>(
      `INSERT INTO applicants (
        id, first_name, last_name, email, phone,
        resume_url, status, application_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW())
      RETURNING id`,
      [id, first_name, last_name, email, phone, resumeUrl]
    );

    // Telegram notification (do not fail request if telegram fails)
    try {
      await sendTelegramNotification(
        `📝 *New Applicant*\nName: ${first_name} ${last_name}\nEmail: ${email}\nResume: ${resumeUrl}`
      );
    } catch (e) {
      console.error("Telegram failed:", e);
    }

    return NextResponse.json({ success: true, id: rows[0]?.id ?? id });
  } catch (err) {
    console.error("❌ /api/apply error:", err);
    return NextResponse.json({ error: "Failed to submit application." }, { status: 500 });
  }
}
