// app/api/admin-login/route.ts
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    const result = await sql<{
      id: string;
      password_hash: string;
    }>`SELECT id, password_hash FROM admin_users WHERE username = ${username}`;

    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    // ✅ Set a simple cookie to track login
    const res = NextResponse.json({ success: true });
    res.cookies.set('admin_auth', 'true', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 2, // 2 hours
      path: '/',
    });

    return res;
  } catch (error) {
    console.error('❌ Admin login error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
