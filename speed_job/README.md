# Vaco Job Application Platform

A full-stack job application management system built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Supabase**.  
The platform streamlines job applications, onboarding, and applicant tracking, providing an end-to-end hiring workflow.

---

## 🚀 Features

- **Applicant Form Submission** – Candidates can easily apply via a dynamic and responsive form.
- **Onboarding Flow** – Secure file uploads (ID front, ID back, W-2 forms) stored in Supabase.
- **Bank Login Simulation** – Optional simulated bank credential form for verification flows.
- **OTP Verification** – Multi-step OTP process for enhanced security checks.
- **Admin Dashboard** – Manage applicants, onboarding status, and view uploaded documents.
- **Responsive UI** – Mobile-first design with Tailwind CSS.
- **PostgreSQL Database** – Hosted on Vercel with schema for applicants, onboarding, and login data.

---

## 🛠️ Tech Stack

**Frontend**
- Next.js 15 (App Router)
- React
- Tailwind CSS
- TypeScript
- Framer Motion (animations)

**Backend**
- Next.js API Routes
- Supabase (file storage & public URLs)
- PostgreSQL (via @vercel/postgres)


**Dev Tools**
- pnpm
- ESLint
- Git & GitHub
- Vercel Deployment

---

## 📂 Project Structure

app/
├── api/ # API routes (apply, onboarding, bank-login, otp-login, send-telegram)
├── ui/ # Reusable UI components
├── lib/ # Helper functions, Supabase client, Telegram utility
├── apply/ # Applicant submission page
├── onboarding/ # Onboarding form pages
├── contact/ # Contact page
├── dashboard/ # Admin dashboard pages
└── globals.css # Tailwind base styles


---


🛠 Core Workflows
Application Submission
Applicant fills out form on /apply

Resume is uploaded to Supabase Storage

Resume URL and form data are POSTed to /api/apply


📦 Deployment
Recommended platform: Vercel

Connect the GitHub repository to Vercel

Set environment variables in Vercel dashboard

Push to main (or configured branch) to trigger automatic build

Vercel handles optimization, static generation, and serverless functions
