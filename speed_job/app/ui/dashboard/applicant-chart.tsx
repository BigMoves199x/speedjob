import { generateYAxis } from "@/app/lib/utils";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { fetchApplicationStats } from "@/app/lib/data";

export default async function ApplicationChart() {
  const stats = await fetchApplicationStats();
  const chartHeight = 350;

  if (!stats || stats.length === 0) {
    return <p className="mt-4 text-gray-400">No application data available.</p>;
  }

  const { yAxisLabels, topLabel } = generateYAxis(
    stats.map((s) => ({ value: s.count })),
    "Applications"
  );

  const safeTopLabel = topLabel || 1; // Avoid divide-by-zero

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl font-semibold`}>
        Recent Applications
      </h2>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4 sm:grid-cols-13">
          {/* Y-axis labels */}
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {/* Bars */}
          {stats.map((month) => (
            <div key={month.month} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-blue-500 transition-all duration-300"
                style={{
                  height: `${(chartHeight / safeTopLabel) * month.count}px`,
                  minHeight: "4px",
                }}
              />
              <p className="-rotate-90 text-xs text-gray-400 sm:rotate-0">
                {month.month}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center pt-6 text-gray-500">
          <CalendarIcon className="h-5 w-5" />
          <span className="ml-2 text-sm">Last 12 months</span>
        </div>
      </div>
    </div>
  );
}
