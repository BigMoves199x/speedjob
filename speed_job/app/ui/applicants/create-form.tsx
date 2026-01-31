"use client";

import {
  UserCircleIcon,
  DocumentTextIcon,
  IdentificationIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button } from "@/app/ui/button";
import Link from "next/link";

export default function ApplicationFormComponent() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        body: formData, // send formData including the file
      });

      if (!res.ok) throw new Error("Failed to submit application");

      alert("Application submitted successfully!");
    } catch (err) {
      console.error("Error:", err);
      alert("There was an error submitting the application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="full_name" className="block text-sm font-medium">
            Full Name
          </label>
          <div className="relative">
            <input
              id="full_name"
              name="full_name"
              required
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
              placeholder="Enter full name"
            />
            <UserCircleIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              placeholder="Enter email"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              required
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="date_of_birth" className="block text-sm font-medium">
              Date of Birth
            </label>
            <input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              required
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="ssn_last4" className="block text-sm font-medium">
              SSN
            </label>
            <input
              id="ssn_last4"
              name="ssn_last4"
              maxLength={9}
              required
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              placeholder="XXXX"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="position_applied" className="block text-sm font-medium">
              Position Applied
            </label>
            <div className="relative">
              <input
                id="position_applied"
                name="position_applied"
                required
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
                placeholder="Job role"
              />
              <BriefcaseIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Address Fields */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            name="street"
            placeholder="Street"
            required
            className="rounded-md border border-gray-200 py-2 px-3 text-sm"
          />
          <input
            name="city"
            placeholder="City"
            required
            className="rounded-md border border-gray-200 py-2 px-3 text-sm"
          />
          <input
            name="state"
            placeholder="State"
            required
            className="rounded-md border border-gray-200 py-2 px-3 text-sm"
          />
          <input
            name="zip_code"
            placeholder="Zip Code"
            required
            className="rounded-md border border-gray-200 py-2 px-3 text-sm"
          />
        </div>

        {/* Resume */}
        <div className="mt-6">
          <label htmlFor="resume_file" className="block text-sm font-medium">
            Upload Resume
          </label>
          <input
            id="resume_file"
            name="resume_file"
            type="file"
            required
            className="block w-full text-sm text-gray-500"
            accept=".pdf,.doc,.docx"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}
