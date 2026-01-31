import Pagination from "@/app/ui/applicants/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/applicants/table";
import { fetchApplicantsPages } from "@/app/lib/data";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchApplicantsPages(query);

  return (
    <div className="w-full">
      <div className="mt-4 flex items-center justify-between gap-2 md:-mt-4">
        <Search placeholder="Search applicant..." />
      </div>

        <Table query={query} currentPage={currentPage} />
     
      <div className="mt-5 flex w-full justify-center">
       
        <Pagination totalPages={totalPages} /> 
      </div>
    </div>
  );
}
