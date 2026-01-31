import { ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="relative min-h-screen bg-[#070a12] flex items-center justify-center px-4 sm:px-6 overflow-hidden text-white">
      {/* Subtle background accents */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:14px_14px]" />

      {/* Card */}
      <div className="relative w-full max-w-lg rounded-[28px] bg-white/5 ring-1 ring-white/10 backdrop-blur shadow-[0_25px_80px_rgba(0,0,0,0.45)] p-6 sm:p-8 text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-300/15 ring-1 ring-emerald-300/30">
          <CheckCircleIcon className="h-12 w-12 text-emerald-300" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Application submitted
        </h1>

        {/* Copy */}
        <p className="mt-3 text-sm sm:text-base text-white/70 leading-relaxed">
          Thank you for applying to <span className="text-white/85 font-medium">SpeedJob</span>.
          <br className="hidden sm:block" />
          Our team will review your application and contact you shortly via{" "}
          <span className="text-white/85 font-medium">email</span> or{" "}
          <span className="text-white/85 font-medium">phone</span>.
        </p>

        <p className="mt-4 text-xs sm:text-sm text-white/55">
          If you have any questions in the meantime, please visit our website and
          use the chat feature to reach us.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="
            mt-6 inline-flex items-center justify-center gap-2
            rounded-2xl px-6 py-3
            bg-emerald-300 text-[#070a12] font-semibold
            hover:brightness-95 transition
            ring-1 ring-white/10
          "
        >
          Back to Home <ArrowRightIcon className="w-5 h-5" />
        </Link>

        {/* Footer note */}
        <p className="mt-6 text-xs text-white/45">
          © {new Date().getFullYear()} SpeedJob
        </p>
      </div>
    </div>
  );
}
