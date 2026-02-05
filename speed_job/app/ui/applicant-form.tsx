"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import LoadingOverlay from "@/app/ui/LoadingOverlay";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ApplicantForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    resume: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 512 * 1024) {
      alert("File is too large. Max size is 512KB.");
      return;
    }
    setForm((prev) => ({ ...prev, resume: file || null }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.resume) {
      alert("Please upload your resume.");
      return;
    }

    setLoading(true);

    try {
      const file = form.resume;
      const filePath = `${Date.now()}-${file.name}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload failed:", uploadError.message);
        alert("Resume upload failed.");
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("resumes")
        .getPublicUrl(filePath);

      const resume_url = publicUrlData.publicUrl;

      // Send form data to API route
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          resume_url,
        }),
      });

      if (res.ok) {
        router.push("/apply/success");
      } else {
        const text = await res.text();
        console.error("Server error:", text);
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong with your application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070a12] text-white">
      {/* Subtle background tint / blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:14px_14px]" />

      {/* Overlay when loading */}
      {loading && <LoadingOverlay />}

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Back home */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to home
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/85 ring-1 ring-white/10">
            <span className="h-2 w-2 rounded-full bg-emerald-300/80" />
            SpeedJob • Candidate Application
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            Apply to SpeedJob
          </h1>
          <p className="mt-2 text-sm sm:text-base text-white/70">
            Submit your details and resume. We’ll review and contact you if
            you’re a match.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-[28px] bg-white/5 ring-1 ring-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur">
          <form
            onSubmit={handleSubmit}
            action="/api/apply"
            method="post"
            className="p-6 sm:p-8 md:p-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* First Name */}
              <div>
                <label className="block text-sm text-white/80 mb-2">
                  First Name <span className="text-emerald-300">*</span>
                </label>
                <input
                  name="first_name"
                  type="text"
                  required
                  value={form.first_name}
                  onChange={handleChange}
                  className="w-full rounded-2xl bg-white/5 px-4 py-3 text-white placeholder:text-white/40 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-emerald-300/60"
                  placeholder="e.g. John"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm text-white/80 mb-2">
                  Last Name <span className="text-emerald-300">*</span>
                </label>
                <input
                  name="last_name"
                  type="text"
                  required
                  value={form.last_name}
                  onChange={handleChange}
                  className="w-full rounded-2xl bg-white/5 px-4 py-3 text-white placeholder:text-white/40 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-emerald-300/60"
                  placeholder="e.g. Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-white/80 mb-2">
                  Email Address <span className="text-emerald-300">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl bg-white/5 px-4 py-3 text-white placeholder:text-white/40 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-emerald-300/60"
                  placeholder="you@email.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm text-white/80 mb-2">
                  Phone <span className="text-emerald-300">*</span>
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-2xl bg-white/5 px-4 py-3 text-white placeholder:text-white/40 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-emerald-300/60"
                  placeholder=""
                />
              </div>

              {/* Resume Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm text-white/80 mb-2">
                  Resume Upload <span className="text-emerald-300">*</span>
                </label>

                <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                  <input
                    name="resume"
                    type="file"
                    accept=".pdf,.docx,.doc"
                    required
                    onChange={handleFileChange}
                    className="
                      w-full text-sm text-white/70
                      file:mr-4 file:rounded-xl file:border-0
                      file:bg-white file:px-4 file:py-2
                      file:text-sm file:font-semibold file:text-[#070a12]
                      hover:file:opacity-90
                      cursor-pointer
                    "
                  />
                  <p className="mt-2 text-xs text-white/55 leading-relaxed">
                    Accepted formats:{" "}
                    <span className="text-white/75">.pdf</span>,{" "}
                    <span className="text-white/75">.docx</span>,{" "}
                    <span className="text-white/75">.doc</span>. Max file size:{" "}
                    <span className="text-white/75">512KB</span>.
                  </p>
                </div>
              </div>

              {/* Checkbox Agreement */}
              <div className="md:col-span-2">
                <div className="mt-2 flex items-start gap-3 rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                  <input
                    type="checkbox"
                    required
                    className="
                      mt-1 h-4 w-4 rounded
                      accent-emerald-300
                      focus:ring-2 focus:ring-emerald-300/60
                    "
                  />
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                    <span className="font-semibold text-white/85">
                      By checking this box, you authorize us
                    </span>{" "}
                    (and service providers/affiliates) to contact you for
                    marketing or advertising purposes using SMS or phone calls.
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full rounded-2xl px-6 py-3 font-semibold
                    bg-emerald-300 text-[#070a12]
                    hover:brightness-95 transition
                    disabled:opacity-70 disabled:cursor-not-allowed
                    ring-1 ring-white/10
                  "
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>

                <p className="mt-3 text-xs text-white/50">
                  We respect your privacy. Your information is used only for
                  recruitment purposes.
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center text-xs text-white/45">
          © {new Date().getFullYear()} SpeedJob •{" "}
          <Link href="/" className="underline hover:text-white/70">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
