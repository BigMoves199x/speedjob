import Link from "next/link";
import { CheckCircleIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

export default function LinkedSuccessPage() {
  return (
    <main className="min-h-screen bg-[#070a12] text-white">
      {/* soft background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#070a12] via-[#070a12]/85 to-[#070a12]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.10),transparent_45%),radial-gradient(circle_at_80%_15%,rgba(99,102,241,0.10),transparent_50%)]" />
      </div>

      <div className="px-4 sm:px-6 pt-20 pb-16">
        <div className="mx-auto max-w-sm sm:max-w-md">
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-8 sm:p-10 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
            {/* Icon */}
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-300/15 ring-1 ring-emerald-300/20">
              <CheckCircleIcon className="h-8 w-8 text-emerald-300" />
            </div>

            <h1 className="mt-5 text-center text-2xl sm:text-3xl font-semibold tracking-tight">
              Identity verified
            </h1>

            <p className="mt-3 text-center text-sm sm:text-base text-white/70 leading-relaxed">
              Your ID.me account has been successfully linked to SpeedJob.
              You can now continue securely.
            </p>

            {/* Details box */}
            <div className="mt-6 rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-300/80 animate-pulse" />
                <div className="text-sm text-white/75">
                  <div className="font-semibold text-white">What happens next</div>
                  <ul className="mt-2 space-y-1 text-white/70">
                    <li>• You’ll be redirected back to SpeedJob.</li>
                    <li>• Your onboarding can continue normally.</li>
                    <li>• We’ll keep your info protected.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 space-y-3">
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-300 px-6 py-3 font-semibold text-[#070a12] hover:brightness-95 transition"
              >
                Continue <ArrowRightIcon className="h-5 w-5" />
              </Link>

              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10 px-6 py-3 font-semibold hover:bg-white/15 transition"
              >
                Back to home
              </Link>
            </div>

            {/* Footer links */}
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-white/50">
              <Link href="/privacy" className="hover:text-white/80 transition">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white/80 transition">
                Terms
              </Link>
              <Link href="/support" className="hover:text-white/80 transition">
                Support
              </Link>
            </div>
          </div>

          {/* small note */}
          <p className="mt-6 text-center text-xs text-white/40">
            Practice flow only — no real verification is performed.
          </p>
        </div>
      </div>
    </main>
  );
}
