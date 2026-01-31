'use client';

import OtpForm from '@/app/ui/otp';
import { Suspense } from 'react';

export default function OtpPage() {
  return (
     <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Suspense fallback={<div>Loading OTP Page...</div>}>
        <OtpForm />
      </Suspense>
    </div>
  );
}
