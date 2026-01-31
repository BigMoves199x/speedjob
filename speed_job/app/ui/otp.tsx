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

  // practice context (optional)
  const email = useMemo(() => search.get("email") ?? "example@email.com", [search]);

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // resend timer (practice UX)
  const [seconds, setSeconds] = useState(30);
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const clean = onlyDigits(code);
    if (clean.length !== 6) {
      alert("Enter a 6-digit code.");
      return;
    }

    setLoading(true);

    // ✅ PRACTICE-ONLY behavior:
    // For demo, accept 123456 as "valid"
    setTimeout(() => {
      setLoading(false);

      if (clean === "123456") {
        router.push("/idme-mock/verified");
      } else {
        alert("Invalid code (practice). Try 123456.");
      }
    }, 900);
  };

  const resend = () => {
    // practice-only: just reset timer
    setSeconds(30);
    alert("Practice: code resent (no real message sent).");
  };

  return (
    <main className="min-h-screen text-[#1f2937]">
      {/* compact centered layout */}
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
                  disabled={seconds > 0}
                  className="text-[#2563eb] underline underline-offset-2 hover:text-[#1d4ed8] disabled:opacity-50 disabled:no-underline"
                >
                  Resend code
                </button>

                <span className="text-[#6b7280]">
                  {seconds > 0 ? `Time ${seconds}s` : ""}
                </span>
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

          {/* footer links */}
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
