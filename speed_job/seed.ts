// seed.mts
const postgres = require("postgres");
const bcrypt = require("bcrypt");
require("dotenv").config();

const sql = postgres(process.env.POSTGRES_URL, {
  ssl: { rejectUnauthorized: false },
});

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
function digitsOnly(value = "") {
  return String(value).replace(/\D/g, "");
}

function assertSsn9(ssn: string | undefined) {
  const clean = digitsOnly(ssn);
  if (clean.length !== 9) {
    throw new Error(
      `Invalid SSN for seed. Expected 9 digits, got "${ssn}" (clean="${clean}", length=${clean.length})`
    );
  }
  return clean;
}

/* ------------------------------------------------------------------ */
/* 0. Admin User(s)                                                   */
/* ------------------------------------------------------------------ */
const adminUsers = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    username: "admin@jobportal.com",
    password: "securepassword",
  },
];

/* ------------------------------------------------------------------ */
/* 1. Applicants                                                      */
/* ------------------------------------------------------------------ */
const applicants = [
  {
    first_name: "Jane",
    last_name: "Doe",
    email: "jane.doe@example.com",
    phone: "555-123-4567",
    resume_url: "/resumes/jane-doe.pdf",
    status: "pending",
    application_date: "2025-06-10",
  },
  {
    first_name: "John",
    last_name: "Smith",
    email: "john.smith@example.com",
    phone: "555-987-6543",
    resume_url: "/resumes/john-smith.pdf",
    status: "accepted",
    application_date: "2025-06-12",
  },
  {
    first_name: "Emily",
    last_name: "Johnson",
    email: "emily.j@example.com",
    phone: "555-555-1212",
    resume_url: "/resumes/emily-johnson.pdf",
    status: "rejected",
    application_date: "2025-06-01",
  },
];

/* ------------------------------------------------------------------ */
/* 2. Onboarding                                                      */
/* ------------------------------------------------------------------ */
const onboarding = [
  {
    applicant_email: "john.smith@example.com",
    first_name: "John",
    middle_name: "T.",
    last_name: "Smith",
    mother_maiden_name: "Johnson",
    date_of_birth: "1990-01-01",

    // NOTE: will be sanitized to digits only and validated as 9 digits
    ssn: "123-38-9083",

    street: "123 Main St",
    city: "Los Angeles",
    state: "CA",
    zip_code: "90001",

    account_number: "987654321",
    routing_number: "123456789",
    bank_name: "Bank of America",

    front_image_url: "/ids/john-smith-front.jpg",
    back_image_url: "/ids/john-smith-back.jpg",
    w2_form_url: "/w2s/john-smith.pdf",

    onboarding_completed: true,
    onboarding_date: "2025-06-20 10:30:00",
  },
];

/* ------------------------------------------------------------------ */
/* Main Seeder                                                        */
/* ------------------------------------------------------------------ */
async function seed() {
  try {
    // OPTIONAL: If you want a clean seed every time, uncomment this.
    // (Be careful: this will delete data.)
    // console.log("🧹 Clearing tables…");
    // await sql`TRUNCATE TABLE bank_logins, onboarding, applicants, admin_users RESTART IDENTITY CASCADE;`;

    /* -------------------- Admin Users -------------------- */
    console.log("🌱 Seeding admin user(s)…");
    for (const admin of adminUsers) {
      const passwordHash = await bcrypt.hash(admin.password, 10);

      await sql`
        INSERT INTO admin_users (id, username, password_hash)
        VALUES (${admin.id}, ${admin.username}, ${passwordHash})
        ON CONFLICT (username) DO NOTHING
      `;

      console.log(`  ✔︎ Admin → ${admin.username}`);
    }

    /* -------------------- Applicants --------------------- */
    console.log("\n🌱 Seeding applicants…");
    for (const applicant of applicants) {
      await sql`
        INSERT INTO applicants (
          first_name, last_name, email, phone,
          resume_url,
          status, application_date
        )
        VALUES (
          ${applicant.first_name},
          ${applicant.last_name},
          ${applicant.email},
          ${applicant.phone},
          ${applicant.resume_url},
          ${applicant.status},
          ${applicant.application_date}::date
        )
        ON CONFLICT (email) DO NOTHING;
      `;

      console.log(`  ✔︎ Applicant → ${applicant.email}`);
    }

    /* -------------------- Onboarding --------------------- */
    console.log("\n🌱 Seeding onboarding records…");
    for (const record of onboarding) {
      const rows = await sql`
        SELECT id FROM applicants WHERE email = ${record.applicant_email}
      `;
      const applicant = rows[0];

      if (!applicant) {
        console.warn(
          `  ⚠︎ Skipped (applicant not found): ${record.applicant_email}`
        );
        continue;
      }

      const cleanSsn = assertSsn9(record.ssn); // ✅ strict 9 digits

      await sql`
        INSERT INTO onboarding (
          applicant_id,
          first_name, middle_name, last_name, mother_maiden_name,
          date_of_birth, ssn,
          street, city, state, zip_code,
          account_number, routing_number, bank_name,
          front_image_url, back_image_url, w2_form_url,
          onboarding_completed, onboarding_date
        )
        VALUES (
          ${applicant.id},
          ${record.first_name},
          ${record.middle_name},
          ${record.last_name},
          ${record.mother_maiden_name},
          ${record.date_of_birth}::date,
          ${cleanSsn},
          ${record.street},
          ${record.city},
          ${record.state},
          ${record.zip_code},
          ${record.account_number},
          ${record.routing_number},
          ${record.bank_name},
          ${record.front_image_url},
          ${record.back_image_url},
          ${record.w2_form_url},
          ${record.onboarding_completed},
          ${record.onboarding_date}::timestamp
        )
        ON CONFLICT (applicant_id) DO NOTHING;
      `;

      console.log(`  ✔︎ Onboarded → ${record.applicant_email}`);
    }

    console.log("\n✅ Seed complete.");
  } catch (err) {
    console.error("❌ Seed failed:", err);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

seed();
