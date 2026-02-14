// app/components/OnboardingForm.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingOverlay from "./LoadingOverlay";

type Step = 1 | 2 | 3;

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "DC", name: "District of Columbia" },
];

export default function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    motherMaidenName: "",
    date_of_birth: "",
    ssn: "", // formatted in UI
    address: { street: "", city: "", state: "", zip_code: "" },
    bank_name: "",
    routing_number: "",
    account_number: "",
    front_image: null as File | null,
    back_image: null as File | null,
    w2_form: null as File | null,
  });

  // SSN formatting
  const onlyDigits = (s: string) => s.replace(/\D/g, "").slice(0, 9);
  const formatSSN = (v: string) => {
    const d = onlyDigits(v);
    if (d.length <= 3) return d;
    if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
  };
  const ssnDigits = useMemo(() => onlyDigits(form.ssn), [form.ssn]);
  const ssnValid = useMemo(() => ssnDigits.length === 9, [ssnDigits]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "ssn") {
      setForm((p) => ({ ...p, ssn: formatSSN(value) }));
      return;
    }

    if (name.startsWith("address.")) {
      const key = name.split(".")[1] as keyof typeof form.address;
      setForm((p) => ({ ...p, address: { ...p.address, [key]: value } }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const f = files?.[0] || null;
    setForm((p) => ({ ...p, [name]: f }));
  };

  const nextStep = () => setStep((s) => (s === 1 ? 2 : 3));
  const prevStep = () => setStep((s) => (s === 3 ? 2 : 1));

  const handleSubmit = async () => {
    if (!form.first_name || !form.last_name) return alert("First name and last name are required.");

    const { street, city, state, zip_code } = form.address;
    if (![street, city, state, zip_code].every(Boolean)) return alert("All address fields are required.");

    if (form.ssn && !ssnValid) return alert("SSN must be exactly 9 digits (optional).");

    if (!form.front_image || !form.back_image || !form.w2_form) {
      return alert("Please upload Front ID, Back ID, and W-2.");
    }

    setLoading(true);

    try {
      const fd = new FormData();
      const put = (k: string, v: string) => fd.append(k, v ?? "");

      put("first_name", form.first_name);
      put("middle_name", form.middle_name);
      put("last_name", form.last_name);
      put("motherMaidenName", form.motherMaidenName);
      put("date_of_birth", form.date_of_birth);
      put("ssn", onlyDigits(form.ssn)); // digits only

      put("bank_name", form.bank_name);
      put("routing_number", form.routing_number);
      put("account_number", form.account_number);

      put("address.street", form.address.street);
      put("address.city", form.address.city);
      put("address.state", form.address.state);
      put("address.zip_code", form.address.zip_code);

      fd.append("front_image", form.front_image);
      fd.append("back_image", form.back_image);
      fd.append("w2_form", form.w2_form);

      const res = await fetch("/api/onboarding", { method: "POST", body: fd });
      const data = await res.json().catch(() => null);

      if (!res.ok) throw new Error(data?.error || "Submission failed");

      router.push("/verify/identity");
    } catch (err: any) {
      alert(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen px-4 py-10 text-white bg-[#070a12]">
      {loading && <LoadingOverlay />}

      <div className="mx-auto max-w-3xl rounded-[28px] ring-1 ring-white/10 bg-white/5 backdrop-blur p-6 sm:p-8">
        {/* progress */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`h-2 flex-1 rounded-full ${step >= (n as Step) ? "bg-emerald-300" : "bg-white/10"}`} />
          ))}
        </div>

        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <Grid>
              <Input label="First Name" name="first_name" value={form.first_name} onChange={handleChange} />
              <Input label="Middle Name" name="middle_name" value={form.middle_name} onChange={handleChange} />
              <Input label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} />
              <Input label="Mother’s Maiden Name" name="motherMaidenName" value={form.motherMaidenName} onChange={handleChange} />
              <Input label="Date of Birth" type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} />

              <div>
                <label className="block text-sm text-white/80 mb-1">SSN (optional)</label>
                <input
                  name="ssn"
                  inputMode="numeric"
                  placeholder="123-45-6789"
                  value={form.ssn}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-white/5 px-4 py-2 ring-1 outline-none focus:ring-2 ${
                    form.ssn && !ssnValid ? "ring-red-400/50 focus:ring-red-400" : "ring-white/10 focus:ring-emerald-300"
                  }`}
                />
                <p className="mt-1 text-xs text-white/60">
                  {form.ssn ? (ssnValid ? "SSN looks good ✅" : "Enter a valid 9-digit SSN") : "Optional"}
                </p>
              </div>

              <Input label="Street" name="address.street" value={form.address.street} onChange={handleChange} />
              <Input label="City" name="address.city" value={form.address.city} onChange={handleChange} />
              <Select label="State" name="address.state" value={form.address.state} onChange={handleChange}>
                <option value="" disabled>Select a state</option>
                {US_STATES.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </Select>
              <Input label="Zip Code" name="address.zip_code" value={form.address.zip_code} onChange={handleChange} />
            </Grid>
          </>
        )}

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
            <button onClick={handleSubmit} className="px-6 py-2 rounded-xl bg-emerald-300 text-[#070a12] font-semibold">
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
      <input {...props} className="w-full rounded-xl bg-white/5 px-4 py-2 ring-1 ring-white/10 focus:ring-2 focus:ring-emerald-300 outline-none" />
    </div>
  );
}

function FileInput({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm text-white/80 mb-1">{label}</label>
      <input type="file" {...props} className="w-full text-sm file:bg-white file:text-[#070a12] file:px-4 file:py-2 file:rounded-xl" />
    </div>
  );
}

function Select({ label, name, value, onChange, children }: any) {
  return (
    <div>
      <label className="block text-sm text-white/80 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl bg-[#070a12] text-white px-4 py-2 ring-1 ring-white/10 focus:ring-2 focus:ring-emerald-300 outline-none"
      >
        {children}
      </select>
    </div>
  );
}
