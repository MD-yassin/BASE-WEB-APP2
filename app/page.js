"use client";

import { useState } from "react";

export default function Home() {
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const bundles = [
    { id: 1, name: "250MBs (24hrs)", price: 20 },
    { id: 2, name: "1.25GB (Till Midnight)", price: 55 },
    { id: 3, name: "1.5GB (3hrs)", price: 50 },
    { id: 4, name: "1GB (24hrs)", price: 99 },
    { id: 5, name: "1GB (1hr)", price: 19 },
    { id: 6, name: "350MBs (7 days)", price: 49 },
    { id: 7, name: "45 Minutes (3hrs)", price: 22 },
    { id: 8, name: "1000 SMS (7 days)", price: 30 },
    { id: 9, name: "200 SMS (24hrs)", price: 10 },
    { id: 10, name: "20 SMS (24hrs)", price: 5 }
  ];

  const submitOrder = async () => {
    if (!selectedBundle || !phone) {
      setMessage("Please select a bundle and enter your phone number.");
      return;
    }

    setSending(true);
    setMessage("");

    const res = await fetch("/api/stk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        amount: selectedBundle.price,
        bundle: selectedBundle.name
      })
    });

    const data = await res.json();
    setSending(false);

    if (data.success) {
      setMessage("MPESA Prompt sent! Enter your PIN to complete payment.");
    } else {
      setMessage("Failed: " + data.error);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-10">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Bingwa Sokoni Bundles
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Affordable bundles delivered instantly. Select your bundle and pay via MPESA.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {bundles.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBundle(b)}
              className={`p-4 rounded-xl border transition-colors ${
                selectedBundle?.id === b.id
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-white border-gray-300 hover:border-blue-400"
              }`}
            >
              <div className="flex justify-between font-medium">
                <span>{b.name}</span>
                <span>Ksh {b.price}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <label className="block text-sm text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            placeholder="2547XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={submitOrder}
          disabled={sending}
          className="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
        >
          {sending ? "Sending STK..." : "Buy Bundle"}
        </button>

        {message && (
          <div className="mt-4 text-center text-sm font-medium text-blue-700">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
