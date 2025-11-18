"use client";

import { useState } from "react";

export default function Home() {
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const bundles = [
    { id: 1, name: "250MBs (24hrs)", price: "Ksh 20" },
    { id: 2, name: "1.25GB (Till Midnight)", price: "Ksh 55" },
    { id: 3, name: "1.5GB (3hrs)", price: "Ksh 50" },
    { id: 4, name: "1GB (24hrs)", price: "Ksh 99" },
    { id: 5, name: "1GB (1hr)", price: "Ksh 19" },
    { id: 6, name: "350MBs (7 days)", price: "Ksh 49" },
    { id: 7, name: "45 Minutes (3hrs)", price: "Ksh 22" },
    { id: 8, name: "1000 SMS (7 days)", price: "Ksh 30" },
    { id: 9, name: "200 SMS (24hrs)", price: "Ksh 10" },
    { id: 10, name: "20 SMS (24hrs)", price: "Ksh 5" }
  ];

  const submitOrder = async () => {
    if (!selectedBundle || !phone) {
      setMessage("Please select a bundle and enter your phone number.");
      return;
    }

    setSending(true);
    setMessage("");

    // Simulate sending process
    setTimeout(() => {
      setSending(false);
      setMessage("Order received! Your bundle will be processed shortly.");
    }, 1500);
  };

  return (
    <main className="flex flex-col items-center px-6 py-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center">Bingwa Sokoni Bundles</h1>
      <p className="text-center text-gray-600 mt-2">
        Affordable bundles delivered instantly. Select your bundle and order now.
      </p>

      <div className="w-full mt-8 space-y-4">
        {bundles.map((bundle) => (
          <button
            key={bundle.id}
            onClick={() => setSelectedBundle(bundle)}
            className={`w-full p-4 rounded-xl border ${
              selectedBundle?.id === bundle.id
                ? "bg-blue-600 text-white border-blue-700"
                : "bg-white border-gray-300"
            }`}
          >
            <div className="flex justify-between">
              <span>{bundle.name}</span>
              <span className="font-semibold">{bundle.price}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="w-full mt-8">
        <label className="text-sm text-gray-700">Phone Number</label>
        <input
          type="tel"
          placeholder="07XXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mt-1 p-3 border rounded-xl"
        />
      </div>

      <button
        onClick={submitOrder}
        disabled={sending}
        className="w-full bg-green-600 text-white py-3 mt-6 rounded-xl font-semibold"
      >
        {sending ? "Sending..." : "Place Order"}
      </button>

      {message && (
        <div className="mt-4 text-center text-sm font-medium text-blue-700">
          {message}
        </div>
      )}
    </main>
  );
}
