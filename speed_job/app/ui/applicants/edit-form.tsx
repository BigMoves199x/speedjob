'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Applicant } from '@/app/lib/definitions';
import { CheckIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import Link from 'next/link';

export default function EditApplicantStatusForm({ applicant }: { applicant: Applicant }) {
  const router = useRouter();
  const [status, setStatus] = useState<Applicant['status']>(applicant.status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/applicants/${applicant.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      alert('Applicant status updated!');
      router.refresh();
    } else {
      alert('Failed to update status.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <div className="mt-1 text-gray-900">{applicant.first_name}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Middle Name</label>
          <div className="mt-1 text-gray-900">{(applicant as any).middle_name ?? 'N/A'}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <div className="mt-1 text-gray-900">{applicant.last_name}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1 text-gray-900">{applicant.email}</div>
        </div>

        <fieldset>
          <legend className="mb-2 block text-sm font-medium text-gray-700">Update Status</legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3 space-y-3">
            {[
              { value: 'pending', label: 'Pending', icon: <ClockIcon className="ml-1 h-4 w-4" />, color: 'text-yellow-500' },
              { value: 'accepted', label: 'Accepted', icon: <CheckIcon className="ml-1 h-4 w-4" />, color: 'text-green-600' },
              { value: 'rejected', label: 'Rejected', icon: <XCircleIcon className="ml-1 h-4 w-4" />, color: 'text-red-600' },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={status === option.value}
                  onChange={() => setStatus(option.value as Applicant['status'])}
                  className={`h-4 w-4 ${option.color}`}
                />
                <span className={`flex items-center text-sm ${option.color.replace('500', '700')}`}>
                  {option.label} {option.icon}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/applicants"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Update Status</Button>
      </div>
    </form>
  );
}
