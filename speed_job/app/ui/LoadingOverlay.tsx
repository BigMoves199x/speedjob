'use client';

import { useEffect } from 'react';

export default function LoadingSpinner() {
  // Lock scroll while route segment is loading
  useEffect(() => {
    const { documentElement, body } = document;
    documentElement.classList.add('overflow-hidden');
    body.classList.add('overflow-hidden');
    return () => {
      documentElement.classList.remove('overflow-hidden');
      body.classList.remove('overflow-hidden');
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="
        fixed inset-0 z-[9999] grid place-items-center
        bg-black/30 backdrop-blur-sm
        pointer-events-auto transition-opacity duration-300
      "
    >
      {/* Full 360° spinner */}
      <div
        className="
          h-12 w-12 rounded-full border-4 border-white/30 border-t-white
          animate-[spin_1s_linear_infinite]
        "
        aria-label="Loading"
      />
    </div>
  );
}
