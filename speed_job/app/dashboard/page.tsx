import CardWrapper from "@/app/ui/dashboard/cards";
import ApplicationsChart from "@/app/ui/dashboard/applicant-chart";
import LatestApplications from "@/app/ui/dashboard/latestapplicant";
import { lusitana } from "@/app/ui/fonts";

export const dynamic = "force-dynamic";

export const metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  return (
    <main className="min-h-screen -m-8 bg-gray-50 py-10 px-4 sm:px-6 lg:px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Heading */}
        <header className="mb-4">
          <h1 className={`${lusitana.className} text-2xl font-bold text-gray-800`}>
            Applicant Dashboard
          </h1>
         
        </header>

        {/* Statistic Cards */}
        <section>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <CardWrapper />
          </div>
        </section>

        {/* Analytics Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Chart Section */}
          <div className="bg-white rounded-2xl p-2 shadow-sm">
            <ApplicationsChart />
          </div>

          {/* Latest Applicants */}
          <div className="bg-white rounded-2xl p-2 shadow-sm">
            <LatestApplications />
          </div>
        </section>
      </div>
    </main>
  );
}
