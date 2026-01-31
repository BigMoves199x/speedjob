"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function SuccessPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    setLoading(true);

    setTimeout(() => {
      router.push("/payment-instruction");
    }, 1500); // 1.5 seconds delay
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md text-center bg-white shadow-lg rounded-2xl p-10">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Onboarding Completed Successfully!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for completing your onboarding. Our team will review your details and get back to you shortly.
        </p>
        <button
          onClick={handleContinue}
          disabled={loading}
          className={`mt-8 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full font-semibold transition-all duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#072a40] hover:bg-blue-800 text-white"
          }`}
        >
          {loading ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </div>
  );
}
