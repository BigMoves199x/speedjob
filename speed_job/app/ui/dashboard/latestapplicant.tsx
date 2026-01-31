import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import { fetchApplicants } from '@/app/lib/data';
import type { ApplicantPreview } from '@/app/lib/definitions';

export default async function LatestApplications() {
  const applicants: ApplicantPreview[] = await fetchApplicants();
  const latestApplicants = applicants.slice(0, 5);

  return (
    <section className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl font-semibold`}>
        Latest Applications
      </h2>

      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {latestApplicants.length === 0 ? (
            <p className="py-4 text-sm text-gray-500">No recent applications.</p>
          ) : (
            latestApplicants.map(({ id, first_name, last_name, email, status }, i) => (
              <article
                key={id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  i !== 0 && 'border-t',
                )}
              >
                <div className="flex flex-col overflow-hidden">
                  <p className="text-sm font-semibold md:text-base truncate">
                    {first_name} {last_name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{email}</p>
                </div>
                <div className="flex flex-col text-right min-w-[120px]">
                  <span
                    className={clsx(
                      'mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide',
                      {
                        'bg-yellow-100 text-yellow-700': status === 'pending',
                        'bg-green-100 text-green-700': status === 'accepted',
                        'bg-red-100 text-red-700': status === 'rejected',
                      }
                    )}
                  >
                    {status}
                  </span>
                </div>
              </article>
            ))
          )}
        </div>

        <footer className="flex items-center pb-2 pt-6 text-gray-500">
          <ArrowPathIcon className="h-5 w-5" />
          <span className="ml-2 text-sm">Updated just now</span>
        </footer>
      </div>
    </section>
  );
}
