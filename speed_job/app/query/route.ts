import { NextResponse } from 'next/server';
import postgres from 'postgres';

// Initialize typed Postgres client
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Define the expected return shape
type ApplicantPreview = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  resume_url: string;
  status: 'pending' | 'accepted' | 'rejected';
  application_date: string;
};

// Fetch all applicants with 'pending' status
async function listPendingApplicants(): Promise<ApplicantPreview[]> {
  return await sql<ApplicantPreview[]>`
    SELECT 
      id,
      first_name,
      last_name,
      email,
      phone,
      resume_url,
      status,
      application_date
    FROM applicants
    WHERE status = 'pending'
    ORDER BY application_date DESC
  `;
}

// Handle GET request
export async function GET() {
  try {
    const applicants = await listPendingApplicants();

    return NextResponse.json(applicants, { status: 200 });
  } catch (error) {
    console.error('[GET /api/query] Failed to fetch applicants:', error);

    return NextResponse.json(
      { error: 'Internal Server Error: Could not retrieve applicants.' },
      { status: 500 }
    );
  }
}
