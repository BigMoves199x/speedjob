import CardWrapper from "@/app/ui/dashboard/cards";
import ApplicationsChart from "@/app/ui/dashboard/applicant-chart";
import LatestApplications from "@/app/ui/dashboard/latestapplicant";
import { lusitana } from "@/app/ui/fonts";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard",
};

function ActionButton({
  label,
  hint,
}: {
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-left hover:bg-gray-50 transition"
    >
      <div className="text-sm font-medium text-gray-900">{label}</div>
      <div className="mt-1 text-xs text-gray-500">{hint}</div>
    </button>
  );
}

export default async function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className={`${lusitana.className} text-2xl font-semibold text-gray-900`}>
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor applicants, onboarding status, and activity in one place.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-xs text-gray-600 border border-gray-200">
              Admin View
            </span>
          </div>
        </div>

        {/* New UX Layout: Left overview + Right content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT PANEL (Overview) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-6 space-y-5">
              {/* Summary Card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Overview
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-gray-900">
                      Applicant Summary
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Quick snapshot of your pipeline.
                    </p>
                  </div>

                  <div className="h-9 w-9 rounded-xl bg-gray-100 border border-gray-200" />
                </div>

                {/* Cards (your existing component) */}
                <div className="mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                    <CardWrapper />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Quick actions
                </p>
                <div className="mt-3 grid gap-3">
                  <ActionButton
                    label="Review pending applications"
                    hint="See who needs attention now."
                  />
                  <ActionButton
                    label="View onboarding records"
                    hint="Track document uploads and status."
                  />
                  <ActionButton
                    label="Export applicants"
                    hint="Download for offline review."
                  />
                </div>

                <p className="mt-4 text-xs text-gray-400">
                  Tip: keep this panel open while reviewing applicants.
                </p>
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT (Feed-style) */}
          <section className="lg:col-span-8 space-y-5">
            {/* Chart Module */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Applications trend
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Monthly view of incoming applications.
                  </p>
                </div>
                <span className="text-xs text-gray-400">Last 12 months</span>
              </div>

              <div className="mt-4">
                <ApplicationsChart />
              </div>
            </div>

            {/* Latest Applicants Module */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Latest applications
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Most recent submissions and their status.
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition"
                >
                  View all
                </button>
              </div>

              <div className="mt-4">
                <LatestApplications />
              </div>
            </div>

            {/* Minimal Footer */}
            <div className="text-xs text-gray-400 px-1">
              © {new Date().getFullYear()} SpeedJob • Internal dashboard
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
