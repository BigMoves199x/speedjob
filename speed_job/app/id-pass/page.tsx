"use client";

import { useState } from "react";
import Link from "next/link";

export default function IdMePasswordMock() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  return (
    <main className="min-h-screen bg-white text-[#1f2937]">
      {/* Top spacing (same vertical rhythm as email page) */}
      <div className="pt-24 px-4">
        <div className="mx-auto max-w-sm">
          {/* Card */}
          <div className="rounded-xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/5 p-8">
            <h1 className="text-center text-2xl font-semibold text-[#111827]">
              Enter your password
            </h1>

            <p className="mt-2 text-center text-sm text-[#6b7280]">
              Sign in to continue to the IRS
            </p>

            {/* Password input */}
            <div className="mt-8">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-[#d1d5db] bg-white px-4 py-3 pr-12 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                />

                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute inset-y-0 right-3 text-sm text-[#2563eb] hover:text-[#1d4ed8]"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Continue button */}
            <button
              type="button"
              onClick={() =>
                alert("Practice-only mock. No real authentication.")
              }
              className="mt-6 w-full rounded-md bg-[#2563eb] py-3 text-sm font-semibold text-white hover:bg-[#1d4ed8] transition"
            >
              Continue
            </button>

            {/* Help links */}
            <div className="mt-6 text-center space-y-2">
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Practice-only mock link.");
                }}
                className="block text-sm text-[#2563eb] underline underline-offset-2 hover:text-[#1d4ed8]"
              >
                Forgot your password?
              </Link>

              <Link
                href="/idme-mock"
                className="block text-sm text-[#2563eb] underline underline-offset-2 hover:text-[#1d4ed8]"
              >
                Use a different email
              </Link>
            </div>

       
          </div>

          {/* Footer */}
          <footer className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-[#2563eb]">
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
      </div>
    </main>
  );
}
