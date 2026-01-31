import ApplicantForm from "../ui/applicant-form";
import LoadingSpinner from "@/app/ui/LoadingOverlay";
import { Suspense } from "react";

export default function ApplyPage() {
  return (
    <div className="min-h-screen ">
      <Suspense fallback={<LoadingSpinner />}>
        <ApplicantForm />
      </Suspense>
    </div>
  );
}
 


     
