import OnboardingForm from "@/app/ui/onboarding-form";
import LoadingSpinner from "@/app/ui/LoadingOverlay";
import { Suspense } from "react";


export default async function OnboardingPage() {
  
  return (
    <div className="min-h-screen">
      <Suspense fallback={<LoadingSpinner />}>
        <OnboardingForm/>
      </Suspense>
    </div>
  );
}
