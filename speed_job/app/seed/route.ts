import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { users, applicants } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// New sample data for bank logins (you can move this to your placeholder-data file)
const bankLogins = [
  {
    applicant_id: applicants[0].id,
    bank_name: 'Bank of America',
    username: 'johnsmith',
    password: 'securePass123!',
  },
];

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await sql`
      INSERT INTO users (id, name, email, password)
      VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

async function seedApplicants() {
  await sql`
    CREATE TABLE IF NOT EXISTS applicants (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      resume_url TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      application_date DATE NOT NULL
    );
  `;

  for (const applicant of applicants) {
    await sql`
      INSERT INTO applicants (
        id, first_name, last_name, email, phone,
        resume_url, status, application_date
      )
      VALUES (
        ${applicant.id}, ${applicant.first_name}, ${applicant.last_name}, ${applicant.email}, ${applicant.phone},
        ${applicant.resume_url}, ${applicant.status}, ${applicant.application_date}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

async function seedBankLogins() {
  await sql`
    CREATE TABLE IF NOT EXISTS bank_logins (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      applicant_id UUID NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
      bank_name TEXT NOT NULL,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  for (const login of bankLogins) {
    await sql`
      INSERT INTO bank_logins (
        applicant_id, bank_name, username, password
      ) VALUES (
        ${login.applicant_id}, ${login.bank_name}, ${login.username}, ${login.password}
      )
      ON CONFLICT DO NOTHING;
    `;
  }
}

export async function GET() {
  try {
    await sql.begin(async (sql) => {
      await seedUsers();
      await seedApplicants();
      await seedBankLogins(); // new
    });

    return new Response(JSON.stringify({ message: 'Database seeded successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Seeding failed:', error);
    return new Response(JSON.stringify({ error: 'Database seed failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
