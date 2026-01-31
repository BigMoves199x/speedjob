import Pagination from "@/app/ui/applicants/pagination";
import Search from "@/app/ui/search";
import OnboardingTable from "@/app/ui/onboarding_table";
import { fetchFullOnboardingRecords, fetchOnboardingPages } from "@/app/lib/data";

interface SearchParams {
  query?: string;
  page?: string;
}

export default async function Page(props: { searchParams?: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query?.trim() ?? "";
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchOnboardingPages(query);
  const onboardings = await fetchFullOnboardingRecords(query, currentPage); // Add pagination + query here if needed

  return (
    <div className="w-full">
      <div className="mt-4 flex items-center justify-between gap-2 md:-mt-4">
        <Search placeholder="Search onboarded applicants..." />
      </div>

      {/* ✅ Onboarding Table */}
      <div className="mt-6">
        <OnboardingTable onboardings={onboardings} currentPage={0} />
      </div>

      {/* ✅ Pagination */}
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
