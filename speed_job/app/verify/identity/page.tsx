"use client";

import Link from "next/link";
import { ShieldCheckIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function VerifyIdentityPage() {
  return (
    <div className="min-h-screen bg-[#070a12] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-[28px] bg-white/5 ring-1 ring-white/10 backdrop-blur p-4 text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-300/15 ring-1 ring-emerald-300/30">
          <ShieldCheckIcon className="h-8 w-8 text-emerald-300" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Verify your identity
        </h1>

        {/* Description */}
        <p className="mt-4 text-white/70 leading-relaxed text-sm sm:text-base">
          To protect your information and comply with regulatory requirements,
          we need to verify your identity.
          <br />
          <br />
          SpeedJob uses <span className="font-medium text-white/85">ID.me</span>,
          a secure identity verification platform trusted by government and
          financial institutions.
        </p>

        {/* Info box */}
        <div className="mt-6 rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 text-left text-sm text-white/70">
          <ul className="space-y-2">
            <li>• Takes about 5–10 minutes</li>
            <li>• Requires a valid government-issued ID</li>
            <li>• Your data remains encrypted and secure</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/session/new"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py- font-semibold ring-1 ring-white/10 hover:bg-white/15 transition"
          >
            I already have an ID.me account
          </Link>

          <a
            href="https://api.id.me/en/registration/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-300 px-4 py-4 font-semibold text-[#070a12] hover:brightness-95 transition"
          >
            Create ID.me account <ArrowRightIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
