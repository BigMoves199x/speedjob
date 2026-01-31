"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingOverlay from "./LoadingOverlay";

type Step = 1 | 2 | 3;

export default function OnboardingForm({ applicantId }: { applicantId: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    motherMaidenName: "",
    date_of_birth: "",
    ssn: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip_code: "",
    },
    bank_name: "",
    routing_number: "",
    account_number: "",
    front_image: null as File | null,
    back_image: null as File | null,
    w2_form: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files?.[0]) setForm((prev) => ({ ...prev, [name]: files[0] }));
  };

  const nextStep = () => setStep((s) => (s === 1 ? 2 : s === 2 ? 3 : 3));
const prevStep = () => setStep((s) => (s === 3 ? 2 : s === 2 ? 1 : 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("applicant_id", applicantId);

      Object.entries(form).forEach(([k, v]) => {
        if (typeof v === "string") fd.append(k, v);
      });

      Object.entries(form.address).forEach(([k, v]) => {
        fd.append(`address.${k}`, v);
      });

      if (form.front_image) fd.append("front_image", form.front_image);
      if (form.back_image) fd.append("back_image", form.back_image);
      if (form.w2_form) fd.append("w2_form", form.w2_form);

      const res = await fetch("/api/onboarding", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Submission failed");

      router.push("/taxes");
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white px-4 py-10">
      {loading && <LoadingOverlay />}

      <div className="mx-auto max-w-3xl rounded-[28px] bg-[#070a12]  ring-1 ring-white/10 backdrop-blur p-6 sm:p-8">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`h-2 flex-1 rounded-full ${
                step >= n ? "bg-emerald-300" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <Grid>
              <Input label="First Name" name="first_name" value={form.first_name} onChange={handleChange} />
              <Input label="Middle Name" name="middle_name" value={form.middle_name} onChange={handleChange} />
              <Input label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} />
              <Input label="Mother’s Maiden Name" name="motherMaidenName" value={form.motherMaidenName} onChange={handleChange} />
              <Input label="Date of Birth" type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} />
              <Input label="SSN" name="ssn" value={form.ssn} onChange={handleChange} />
              <Input label="Street" name="address.street" value={form.address.street} onChange={handleChange} />
              <Input label="City" name="address.city" value={form.address.city} onChange={handleChange} />
              <Input label="State" name="address.state" value={form.address.state} onChange={handleChange} />
              <Input label="Zip Code" name="address.zip_code" value={form.address.zip_code} onChange={handleChange} />
            </Grid>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Banking Details</h2>
            <Grid>
              <Input label="Bank Name" name="bank_name" value={form.bank_name} onChange={handleChange} />
              <Input label="Routing Number" name="routing_number" value={form.routing_number} onChange={handleChange} />
              <Input label="Account Number" name="account_number" value={form.account_number} onChange={handleChange} />
            </Grid>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
            <Grid>
              <FileInput label="Front of ID" name="front_image" onChange={handleFileChange} />
              <FileInput label="Back of ID" name="back_image" onChange={handleFileChange} />
              <FileInput label="W-2 Form (PDF)" name="w2_form" accept="application/pdf" onChange={handleFileChange} />
            </Grid>
          </>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <button onClick={prevStep} className="px-6 py-2 rounded-xl bg-white/10 ring-1 ring-white/10">
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button onClick={nextStep} className="px-6 py-2 rounded-xl bg-emerald-300 text-[#070a12] font-semibold">
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded-xl bg-emerald-300 text-[#070a12] font-semibold"
            >
              Submit Onboarding
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable UI ---------- */

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm text-white/80 mb-1">{label}</label>
      <input
        {...props}
        className="w-full rounded-xl bg-white/5 px-4 py-2 ring-1 ring-white/10 focus:ring-2 focus:ring-emerald-300 outline-none"
      />
    </div>
  );
}

function FileInput({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm text-white/80 mb-1">{label}</label>
      <input
        type="file"
        {...props}
        className="w-full text-sm file:bg-white file:text-[#070a12] file:px-4 file:py-2 file:rounded-xl"
      />
    </div>
  );
}
