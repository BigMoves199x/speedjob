import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function VerifiedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full text-center">
        <CheckCircleIcon className="mx-auto h-20 w-20 text-green-500 mb-6" />

        <h1 className="text-sm font-bold text-gray-800 mb-2">
          Account Connected!
        </h1>
        <p className="text-gray-600 text-sm mb-4">
          You have successfully sync your account with plaid.
        </p>
        <h1 className="text-sm font-bold text-gray-800 mb-2">
          Your data belongs to you
        </h1>
        <p className="text-gray-600 text-sm">
          Plaid doesn't sell personal information and will always use with
          permission
        </p>
      </div>
    </div>
  );
}
