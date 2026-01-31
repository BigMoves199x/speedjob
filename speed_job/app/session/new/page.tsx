"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function IdMeMockPage() {
  const [email, setEmail] = useState("");
  const [remember, setRemember] = useState(false);

  return (
    <main className="min-h-screen bg-white text-[#1f2937]">
      {/* Top brand row */}
      <header className="pt-8 pb-4">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-4 px-4">
          {/* Replace these with your own logos in /public if you want */}
          <div className="relative h-10 w-48">
            <Image
              src="/idme.png"
              alt="ID.me logo"
              fill
              className="object-contain"
              priority
            />
          </div>

        </div>
      </header>

      {/* Center card */}
      <section className="px-4 py-4">
        <div className="mx-auto w-full max-w-sm">
          <div className="rounded-xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/5 p-4">
            <h1 className="text-center text-2xl font-semibold text-[#111827]">
              Sign in to ID.me
            </h1>

            {/* Email */}
            <div className="mt-8">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-[#d1d5db] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
              />
            </div>

            {/* Remember me */}
            <div className="mt-4 flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-[#d1d5db] text-[#2563eb] focus:ring-[#2563eb]"
              />
              <label htmlFor="remember" className="text-sm text-[#111827]">
                Remember me
              </label>
            </div>

            {/* Continue button */}
            <button
              type="button"
              onClick={() => alert("Practice-only mock. No real sign-in.")}
              className="mt-6 w-full rounded-md bg-[#2563eb] py-3 text-sm font-semibold text-white hover:bg-[#1d4ed8] transition"
            >
              Continue
            </button>

            {/* Create account line */}
            <p className="mt-5 text-center text-sm text-[#374151]">
              New to ID.me?{" "}
              <Link
                href="/idme-mock/create"
                className="text-[#2563eb] underline underline-offset-2 hover:text-[#1d4ed8]"
              >
                Create an account
              </Link>
            </p>
          </div>

          {/* Language selector */}
          <div className="mt-8 flex items-center justify-center">
            <button
              type="button"
              className="text-sm text-[#2563eb] hover:text-[#1d4ed8] underline underline-offset-2"
              onClick={() => alert("Practice-only mock language dropdown.")}
            >
              English
            </button>
          </div>

          {/* Footer links */}
          <footer className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-[#2563eb]">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Practice-only mock link.");
              }}
              className="underline underline-offset-2 hover:text-[#1d4ed8]"
            >
              What is ID.me?
            </a>
            <span className="text-[#9ca3af]">|</span>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Practice-only mock link.");
              }}
              className="underline underline-offset-2 hover:text-[#1d4ed8]"
            >
              Terms of Service
            </a>
            <span className="text-[#9ca3af]">|</span>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Practice-only mock link.");
              }}
              className="underline underline-offset-2 hover:text-[#1d4ed8]"
            >
              Privacy Policy
            </a>
          </footer>
        </div>
      </section>
    </main>
  );
}
