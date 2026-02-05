// app/api/admin-login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

// Create a single pool (reused across requests)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Supabase often requires SSL; this works well on Vercel too
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    // Query user
    const { rows } = await pool.query<{
      id: string;
      password_hash: string;
    }>(
      `SELECT id, password_hash
       FROM admin_users
       WHERE username = $1
       LIMIT 1`,
      [username]
    );

    const user = rows[0];

    // Validate credentials
    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    // Set cookie
    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_auth", "true", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 2, // 2 hours
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("❌ Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
