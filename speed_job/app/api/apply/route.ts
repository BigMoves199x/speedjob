import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { randomUUID } from 'crypto';
import { sendTelegramNotification } from '@/app/lib/sendTelegramNotification';

export async function POST(req: NextRequest) {
  try {
    console.log('📥 Receiving JSON form submission...');

    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    const body = await req.json();

    const first_name = body.first_name?.toString().trim() || '';
    const last_name = body.last_name?.toString().trim() || '';
    const email = body.email?.toString().trim().toLowerCase() || '';
    const phone = body.phone?.toString().trim() || '';
    const resumeUrl = body.resume_url?.toString().trim() || '';

    console.log('📝 Parsed Data:', { first_name, last_name, email, phone, resumeUrl });

    if (!first_name || !last_name || !email || !phone || !resumeUrl) {
      console.warn('⚠️ Missing required fields');
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const id = randomUUID();

    // Insert into PostgreSQL
    console.log('🛢 Inserting into PostgreSQL...');
    const result = await sql`
      INSERT INTO applicants (
        id, first_name, last_name, email, phone,
        resume_url, status, application_date
      )
      VALUES (
        ${id},
        ${first_name}, ${last_name}, ${email}, ${phone},
        ${resumeUrl}, 'pending', CURRENT_DATE
      )
      RETURNING id
    `;

    console.log('✅ Database insert successful:', result.rows[0]);

    // Send Telegram notification
    console.log('📨 Sending Telegram notification...');
    try {
      await sendTelegramNotification(
        `📝 *New Applicant*\nName: ${first_name} ${last_name}\nEmail: ${email}\nResume: ${resumeUrl}`
      );
      console.log('✅ Telegram notification sent.');
    } catch (telegramErr) {
      console.error('❌ Telegram notification failed:', telegramErr);
    }

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error('❌ /api/apply error (unhandled):', err);
    return NextResponse.json({ error: 'Failed to submit application.' }, { status: 500 });
  }
}
