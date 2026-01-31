import { formatDateToLocal } from "@/app/lib/utils";
import ApplicantStatus from "@/app/ui/applicants/status";
import { OnboardingDashboardRecord } from "../lib/definitions";

interface OnboardingTableProps {
  onboardings: OnboardingDashboardRecord[];
  currentPage: number;
}

export default function OnboardingTable({ onboardings, currentPage }: OnboardingTableProps) {
  if (!onboardings.length) {
    return <p className="p-6 text-center text-gray-500">No onboarding records found.</p>;
  }

  return (
    <section className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {onboardings.map((record) => (
              <div
                key={record.applicant_id}
                className="rounded-md bg-white p-4 shadow-sm space-y-2"
              >
                <div className="font-semibold text-lg">
                  {record.applicant_first_name} {record.applicant_last_name}
                </div>
                <p className="text-sm text-gray-600">{record.email}</p>
                <p className="text-sm text-gray-600">{record.phone}</p>
                <p className="text-sm text-gray-600">
                  {record.onboarding_date ? formatDateToLocal(record.onboarding_date) : "—"}
                </p>
                <p className="text-sm text-gray-600">
                  {record.street}, {record.city}, {record.state} {record.zip_code}
                </p>
                <p className="text-sm text-gray-600">
                  Bank: {record.bank_name || "—"}<br />
                  Acct: {record.account_number || "—"}
                </p>
                <div className="text-sm flex flex-wrap gap-3 mt-2">
                  {record.front_image_url && (
                    <a
                      href={record.front_image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Front ID
                    </a>
                  )}
                  {record.back_image_url && (
                    <a
                      href={record.back_image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Back ID
                    </a>
                  )}
                  {record.w2_form_url && (
                    <a
                      href={record.w2_form_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      W2 Form
                    </a>
                  )}
                </div>
                <ApplicantStatus status={record.status} />
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <table className="hidden min-w-full text-sm text-gray-900 md:table">
            <thead className="text-left text-gray-700 font-semibold border-b">
              <tr>
                <th className="px-4 py-3 sm:pl-6">Name</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Phone</th>
                <th className="px-3 py-3">Address</th>
                <th className="px-3 py-3">Bank Info</th>
                <th className="px-3 py-3">Documents</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {onboardings.map((record) => (
                <tr key={record.applicant_id} className="hover:bg-gray-50 transition">
                  <td className="py-3 pl-6 pr-3 whitespace-nowrap font-medium">
                    {record.applicant_first_name} {record.applicant_last_name}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">{record.email}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{record.phone}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {record.street}, {record.city}, {record.state} {record.zip_code}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {record.bank_name || "—"}
                    <br />
                    Acct: {record.account_number || "—"}
                    <br />
                    Routing: {record.routing_number || "—"}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap space-x-2">
                    {record.front_image_url && (
                      <a
                        href={record.front_image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Front
                      </a>
                    )}
                    {record.back_image_url && (
                      <a
                        href={record.back_image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Back
                      </a>
                    )}
                    {record.w2_form_url && (
                      <a
                        href={record.w2_form_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        W2
                      </a>
                    )}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <ApplicantStatus status={record.status} />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {record.onboarding_date ? formatDateToLocal(record.onboarding_date) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
