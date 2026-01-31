'use client';

import { useState, useTransition } from "react";
import clsx from "clsx";

export default function StatusDropdown({
  id,
  initialStatus,
}: {
  id: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  const updateStatus = async (newStatus: string) => {
    setStatus(newStatus);
    startTransition(async () => {
      await fetch(`/api/applicants/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    });
  };

  const statusColor = {
    pending: "text-yellow-600",
    accepted: "text-green-600",
    rejected: "text-red-600",
  }[status];

  return (
    <div className="relative w-fit">
      <select
        value={status}
        onChange={(e) => updateStatus(e.target.value)}
        className={clsx(
          "appearance-none px-4 py-2 pr-10 text-sm rounded-md border shadow-sm bg-white",
          "transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "hover:border-blue-400",
          statusColor
        )}
      >
        <option value="pending">Pending</option>
        <option value="accepted">Accepted</option>
        <option value="rejected">Rejected</option>
      </select>

      
    </div>
  );
}