'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BankLogin from '@/app/ui/bank-login';

const BANKS = [
  { name: 'Chase', logo: '/banks/Chase.png' },
  { name: 'Wells Fargo', logo: '/banks/Wells_Fargo.png' },
  { name: 'US Bank', logo: '/banks/us-bank.png' },
  { name: 'Capital One', logo: '/banks/Capital_One.png' },
  { name: 'Bank Of America', logo: '/banks/Boa.png' },
  { name: 'Santander', logo: '/banks/Satander.png' },
  { name: 'PNC', logo: '/banks/PNC.png' },
  { name: 'American Express', logo: '/banks/American_Express.png' },
  { name: 'Citi Bank', logo: '/banks/Citibank.png' },
  { name: 'Goldman Sachs', logo: '/banks/Goldman-Sachs.png' },
  { name: 'Fith Third Bank', logo: '/banks/Fifth-Third.png' },
  { name: 'TD Bank', logo: '/banks/TD_Bank.png' },
  { name: 'Ally Bank', logo: '/banks/Ally.png' },
  { name: 'Truist', logo: '/banks/Truist.png' },
];

export default function PaymentMethodPage() {
  const [search, setSearch] = useState('');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const filteredBanks = BANKS.filter((bank) =>
    bank.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6">
        <AnimatePresence mode="wait">
          {!selectedBank ? (
            <motion.div
              key="bank-select"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Select your Bank</h1>

              <input
                type="text"
                placeholder="🔍 Search for your institution"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full mb-6 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />

              <motion.div
                className="grid grid-cols-3 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                }}
              >
                {filteredBanks.map((bank) => (
                  <motion.button
                    key={bank.name}
                    onClick={() => setSelectedBank(bank.name)}
                    className="bg-white p-4 rounded-xl shadow hover:shadow-md flex items-center justify-center transition-transform hover:scale-105 border border-gray-200"
                    whileHover={{ scale: 1.08 }}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  >
                    <img src={bank.logo} alt={bank.name} className="h-10 object-contain" />
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="bank-login"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5 }}
            >
              <BankLogin bankName={selectedBank} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
