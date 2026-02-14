// app/api/apply/route.ts
import { NextRequest, NextResponse } from "next/server";
import  sendTelegramNotification  from "@/app/lib/sendTelegramNotification";

export const runtime = "nodejs";

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
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // ✅ Telegram message (Markdown + clickable URL)
    const message =
      `📝 *New Applicant (Jobverra)*\n` +
      `👤 Name: ${first_name} ${last_name}\n` +
      `📧 Email: ${email}\n` +
      `📱 Phone: ${phone}\n` +
      `📎 Resume: ${resumeUrl}`;

    await sendTelegramNotification(message, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ /api/apply error:", err);
    return NextResponse.json(
      { error: "Failed to submit application." },
      { status: 500 }
    );
  }
}
