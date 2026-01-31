'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const OnboardingSchema = z.object({
  applicant_id: z.string().uuid(),

  // Name fields
  first_name: z.string().min(1),
  middle_name: z.string().min(1),
  last_name: z.string().min(1),
  mother_MaidenName: z.string().min(1),

  // Personal details
  ssn: z.string().min(4), // Consider stricter validation
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip_code: z.string().min(4),

  // Banking
  account_number: z.string().min(4),
  routing_number: z.string().min(4),
  bank_name: z.string().min(1),

  // Uploaded files
  front_image_url: z.string().url(),
  back_image_url: z.string().url(),
  w2_form_url: z.string().url(), // ✅ changed from `w2_form`
});

export async function createOnboarding(formData: FormData) {
  try {
    const parsed = OnboardingSchema.parse({
      applicant_id: formData.get('applicant_id'),
      first_name: formData.get('first_name'),
      middle_name: formData.get('middle_name'),
      last_name: formData.get('last_name'),
      mother_MaidenName: formData.get('mother_MaidenName'),
      ssn: formData.get('ssn'),
      street: formData.get('street'),
      city: formData.get('city'),
      state: formData.get('state'),
      zip_code: formData.get('zip_code'),
      account_number: formData.get('account_number'),
      routing_number: formData.get('routing_number'),
      bank_name: formData.get('bank_name'),
      front_image_url: formData.get('front_image_url'),
      back_image_url: formData.get('back_image_url'),
      w2_form_url: formData.get('w2_form_url'),
    });

    await sql`
      INSERT INTO onboarding (
        applicant_id,
        first_name, middle_name, last_name, mother_MaidenName, ssn,
        street, city, state, zip_code,
        account_number, routing_number, bank_name,
        front_image_url, back_image_url, w2_form_url,
        onboarding_completed, onboarding_date
      )
      VALUES (
        ${parsed.applicant_id},
        ${parsed.first_name}, ${parsed.middle_name}, ${parsed.last_name}, ${parsed.mother_MaidenName}, ${parsed.ssn},
        ${parsed.street}, ${parsed.city}, ${parsed.state}, ${parsed.zip_code},
        ${parsed.account_number}, ${parsed.routing_number}, ${parsed.bank_name},
        ${parsed.front_image_url}, ${parsed.back_image_url}, ${parsed.w2_form_url},
        true, NOW()
      )
      ON CONFLICT (applicant_id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        middle_name = EXCLUDED.middle_name,
        last_name = EXCLUDED.last_name,
        mother_MaidenName = EXCLUDED.mother_MaidenName,
        ssn = EXCLUDED.ssn,
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

    revalidatePath('/dashboard/onboarding');
    redirect('/dashboard/onboarding');
  } catch (error) {
    console.error('Onboarding submission failed:', error);
    throw new Error('Failed to complete onboarding. Please try again.');
  }
}
