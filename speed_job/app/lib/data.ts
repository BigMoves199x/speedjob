import postgres from 'postgres';
import {
  Applicant,
  ApplicantPreview,
  ApplicantOnboarding,
  OnboardingForm,
  OnboardingDashboardRecord,
} from './definitions';
import { createClient } from '@supabase/supabase-js';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PAGE_SIZE = 10;

// ===============================
// Applicants
// ===============================

export async function fetchApplicants(): Promise<ApplicantPreview[]> {
  try {
    const data = await sql<ApplicantPreview[]>`
      SELECT id, first_name, last_name, email, phone, status, application_date
      FROM applicants
      ORDER BY application_date DESC
    `;
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch applicants:', error);
    throw new Error('Could not load applicant data.');
  }
}

export async function fetchApplicantById(id: string): Promise<Applicant & { onboarding: ApplicantOnboarding | null }> {
  try {
    const [data] = await sql<
      (Applicant & {
        ob_first_name: string | null;
        middle_name: string | null;
        ob_last_name: string | null;
        mother_maiden_name: string | null;
        ssn: string | null;
        street: string | null;
        city: string | null;
        state: string | null;
        zip_code: string | null;
        account_number: string | null;
        routing_number: string | null;
        bank_name: string | null;
        front_image_url: string | null;
        back_image_url: string | null;
        w2_form_url: string | null;
        onboarding_completed: boolean | null;
        onboarding_date: string | null;
      })[]
    >`
      SELECT 
        a.id, a.first_name, a.last_name, a.email, a.phone, a.status,
        o.first_name AS ob_first_name,
        o.middle_name,
        o.last_name AS ob_last_name,
        o.mother_maiden_name,
        o.ssn,
        o.street, o.city, o.state, o.zip_code,
        o.account_number, o.routing_number, o.bank_name,
        o.front_image_url, o.back_image_url,
        o.w2_form_url, o.onboarding_completed, o.onboarding_date
      FROM applicants a
      LEFT JOIN onboarding o ON o.applicant_id = a.id
      WHERE a.id = ${id}
    `;

    if (!data) throw new Error('Applicant not found');

    const {
      ob_first_name,
      middle_name,
      ob_last_name,
      mother_maiden_name,
      ssn,
      street,
      city,
      state,
      zip_code,
      account_number,
      routing_number,
      bank_name,
      front_image_url,
      back_image_url,
      w2_form_url,
      onboarding_completed,
      onboarding_date,
      ...applicant
    } = data;

    // Determine if onboarding data exists
    const hasOnboardingData =
      ob_first_name ||
      ob_last_name ||
      mother_maiden_name ||
      ssn ||
      street ||
      city ||
      state ||
      zip_code ||
      account_number ||
      routing_number ||
      bank_name ||
      front_image_url ||
      back_image_url ||
      w2_form_url;

    return {
      ...applicant,
      onboarding: hasOnboardingData
        ? {
            applicant_id: applicant.id,
            first_name: ob_first_name || '',
            middle_name: middle_name || '',
            last_name: ob_last_name || '',
            motherMaidenName: mother_maiden_name || '',
            ssn: ssn || '',
            address: {
              street: street || '',
              city: city || '',
              state: state || '',
              zip_code: zip_code || '',
            },
            bank_account: {
              account_number: account_number || '',
              routing_number: routing_number || '',
              bank_name: bank_name || '',
            },
            id_documents: {
              front_image_url: front_image_url || '',
              back_image_url: back_image_url || '',
            },
            w2_form_url: w2_form_url || '',
            onboarding_completed: onboarding_completed ?? false,
            onboarding_date: onboarding_date || undefined,
          }
        : null,
    };
  } catch (error) {
    console.error('❌ Failed to fetch applicant:', error);
    throw new Error('Could not load applicant.');
  }
}


export async function submitApplication(formData: FormData) {
  const id = formData.get('id')?.toString()!;
  const first_name = formData.get('first_name')?.toString()!;
  const last_name = formData.get('last_name')?.toString()!;
  const email = formData.get('email')?.toString()!;
  const phone = formData.get('phone')?.toString()!;
  const application_date = new Date().toISOString().split('T')[0];

  const resumeFile = formData.get('resume') as File;
  if (!resumeFile || typeof resumeFile.name !== 'string') {
    throw new Error('Invalid resume file');
  }

  const fileExt = resumeFile.name.split('.').pop();
  const filePath = `resumes/${id}.${fileExt}`;

  // ✅ Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(filePath, resumeFile, {
      contentType: resumeFile.type,
      upsert: true,
    });

  if (uploadError) {
    console.error('❌ Resume upload failed:', uploadError);
    throw new Error('Resume upload failed');
  }

  const { data: publicData } = supabase.storage
    .from('resumes')
    .getPublicUrl(filePath);

  const resume_url = publicData?.publicUrl;

  // ✅ Insert applicant
  await sql`
    INSERT INTO applicants (
      id,
      first_name,
      last_name,
      email,
      phone,
      resume_url,
      status,
      application_date
    ) VALUES (
      ${id},
      ${first_name},
      ${last_name},
      ${email},
      ${phone},
      ${resume_url},
      'pending',
      ${application_date}
    )
  `;
}


export async function fetchApplicantStatus(id: string) {
  try {
    const [result] = await sql<
      { id: string; first_name: string; last_name: string; status: string }[]
    >`
      SELECT id, first_name, last_name, status 
      FROM applicants 
      WHERE id = ${id}
    `;
    return result ?? null;
  } catch (error) {
    console.error('❌ Failed to fetch applicant status:', error);
    throw new Error('Unable to retrieve applicant status.');
  }
}

// ===============================
// Onboarding
// ===============================

export async function fetchOnboardingData(applicant_id: string): Promise<ApplicantOnboarding | null> {
  try {
    const [data] = await sql<ApplicantOnboarding[]>`
      SELECT * FROM onboarding WHERE applicant_id = ${applicant_id}
    `;
    return data ?? null;
  } catch (error) {
    console.error('❌ Failed to fetch onboarding data:', error);
    throw new Error('Could not load onboarding record.');
  }
}

export async function submitOnboardingInfo(data: OnboardingForm) {
  const {
    applicant_id,
    first_name,
    middle_name,
    last_name,
    motherMaidenName,
    ssn,
    date_of_birth,
    address,
    bank_account,
    id_documents,
    w2_form_url,
  } = data;

  try {
    await sql`
      INSERT INTO onboarding (
        applicant_id,
        first_name,
        middle_name,
        last_name,
        mother_maiden_name,
        ssn,
        date_of_birth,
        street,
        city,
        state,
        zip_code,
        account_number,
        routing_number,
        bank_name,
        front_image_url,
        back_image_url,
        w2_form_url,
        onboarding_completed,
        onboarding_date
      )
      VALUES (
        ${applicant_id},
        ${first_name},
        ${middle_name},
        ${last_name},
        ${motherMaidenName},
        ${ssn},                            -- ⚠️ Encrypt before storing in production
        ${date_of_birth},
        ${address.street},
        ${address.city},
        ${address.state},
        ${address.zip_code},
        ${bank_account.account_number},
        ${bank_account.routing_number},
        ${bank_account.bank_name},
        ${id_documents.front_image_url},
        ${id_documents.back_image_url},
        ${w2_form_url},
        true,
        NOW()
      )
      ON CONFLICT (applicant_id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        middle_name = EXCLUDED.middle_name,
        last_name = EXCLUDED.last_name,
        mother_maiden_name = EXCLUDED.mother_maiden_name,
        ssn = EXCLUDED.ssn,
        date_of_birth = EXCLUDED.date_of_birth,
        street = EXCLUDED.street,
        city = EXCLUDED.city,
        state = EXCLUDED.state,
        zip_code = EXCLUDED.zip_code,
        account_number = EXCLUDED.account_number,
        routing_number = EXCLUDED.routing_number,
        bank_name = EXCLUDED.bank_name,
        front_image_url = EXCLUDED.front_image_url,
        back_image_url = EXCLUDED.back_image_url,
        w2_form_url = EXCLUDED.w2_form_url,
        onboarding_completed = true,
        onboarding_date = NOW()
    `;
  } catch (error) {
    console.error('❌ Failed to submit onboarding info:', error instanceof Error ? error.message : error);
    throw new Error('Saving onboarding info failed.');
  }
}


// ===============================
// Dashboard Stats
// ===============================

export async function fetchCardData() {
  try {
    const [total, pending, accepted, rejected] = await Promise.all([
      sql<{ count: string }[]>`SELECT COUNT(*) FROM applicants`,
      sql<{ count: string }[]>`SELECT COUNT(*) FROM applicants WHERE status = 'pending'`,
      sql<{ count: string }[]>`SELECT COUNT(*) FROM applicants WHERE status = 'accepted'`,
      sql<{ count: string }[]>`SELECT COUNT(*) FROM applicants WHERE status = 'rejected'`,
    ]);

    return {
      totalApplicants: Number(total[0].count),
      pendingApplicants: Number(pending[0].count),
      acceptedApplicants: Number(accepted[0].count),
      rejectedApplicants: Number(rejected[0].count),
    };
  } catch (error) {
    console.error('❌ Failed to load dashboard cards:', error);
    throw new Error('Dashboard stats unavailable.');
  }
}

export async function fetchApplicationStats() {
  try {
    const stats = await sql<{ month: string; count: string }[]>`
      SELECT
        TO_CHAR(DATE_TRUNC('month', application_date), 'Mon') AS month,
        COUNT(*) AS count
      FROM applicants
      WHERE application_date >= CURRENT_DATE - INTERVAL '1 year'
      GROUP BY DATE_TRUNC('month', application_date)
      ORDER BY DATE_TRUNC('month', application_date)
    `;

    return stats.map((row) => ({
      month: row.month,
      count: Number(row.count),
    }));
  } catch (error) {
    console.error('❌ Failed to load monthly stats:', error);
    throw new Error('Monthly statistics not available.');
  }
}

// ===============================
// Pagination
// ===============================

export async function fetchApplicantsPages(query: string): Promise<number> {
  const where = query
    ? sql`WHERE first_name || ' ' || last_name ILIKE ${'%' + query + '%'}`
    : sql``;

  try {
    const [result] = await sql<{ count: string }[]>`
      SELECT COUNT(*) FROM applicants ${where}
    `;
    return Math.ceil(Number(result.count) / PAGE_SIZE);
  } catch (error) {
    console.error('❌ Failed to calculate applicant pages:', error);
    throw new Error('Pagination failed.');
  }
}

export async function fetchOnboardingPages(query: string): Promise<number> {
  try {
    const [result] = await sql<{ count: string }[]>`
      SELECT COUNT(*) FROM onboarding o
      JOIN applicants a ON o.applicant_id = a.id
      ${query
        ? sql`WHERE a.first_name || ' ' || a.last_name ILIKE ${'%' + query + '%'}` 
        : sql``}
    `;
    return Math.ceil(Number(result.count) / PAGE_SIZE);
  } catch (error) {
    console.error('❌ Error calculating onboarding pages:', error);
    throw new Error('Failed to paginate onboarding data.');
  }
}

// ===============================
// Onboarding Dashboard Table
// ===============================

export async function fetchFullOnboardingRecords(query = "", page = 1): Promise<OnboardingDashboardRecord[]> {
  const offset = (page - 1) * PAGE_SIZE;

  try {
    const records = await sql<OnboardingDashboardRecord[]>`
      SELECT
        a.id AS applicant_id,
        a.first_name AS applicant_first_name,
        a.last_name AS applicant_last_name,
        a.email,
        a.phone,
        a.resume_url,
        a.status,
        o.street,
        o.city,
        o.state,
        o.zip_code,
        o.bank_name,
        o.account_number,
        o.routing_number,
        o.front_image_url,
        o.back_image_url,
        '/w2s/' || a.id || '.pdf' AS w2_form_url,
        o.onboarding_completed,
        o.onboarding_date
      FROM onboarding o
      JOIN applicants a ON o.applicant_id = a.id
      WHERE a.first_name ILIKE ${'%' + query + '%'}
         OR a.last_name ILIKE ${'%' + query + '%'}
         OR a.email ILIKE ${'%' + query + '%'}
      ORDER BY o.onboarding_date DESC
      LIMIT ${PAGE_SIZE} OFFSET ${offset};
    `;

    return records;
  } catch (error) {
    console.error('❌ Failed to fetch onboarding dashboard records:', error);
    throw new Error('Unable to load onboarding dashboard.');
  }
}
