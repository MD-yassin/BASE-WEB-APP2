"use client";

import { useState } from "react";

export default function Home() {
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [payer, setPayer] = useState("");       // number that will be charged (payer)
  const [recipient, setRecipient] = useState(""); // number that will receive the bundle
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

  function normalizeDisplay(num) {
    if (!num) return "";
    // Show raw but keep placeholder hint for 254 format
    return num;
  }

  const submitOrder = async () => {
    if (!selectedBundle) {
      setMessage("Please select a bundle.");
      return;
    }
    if (!payer) {
      setMessage("Please enter the number that will pay (payer).");
      return;
    }
    if (!recipient) {
      setMessage("Please enter the number that should receive the bundle.");
      return;
    }

    setSending(true);
    setMessage("");

    try {
      const res = await fetch("/api/stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payerPhone: payer,
          recipientPhone: recipient,
          amount: selectedBundle.price,
          bundle: selectedBundle.name
        })
      });

      const data = await res.json();
      setSending(false);

      if (data.success) {
        // show the MPESA CheckoutRequestID if available
        setMessage(
          "STK push sent to payer. Please enter PIN on your phone. " +
          (data.checkoutRequestID ? `CheckoutRequestID: ${data.checkoutRequestID}` : "")
        );
      } else {
        setMessage("Failed to send STK: " + (data.error || JSON.stringify(data)));
      }
    } catch (err) {
      setSending(false);
      setMessage("Network error: " + err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="max-w-xl w-full bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-2">Bingwa Sokoni Bundles</h1>
        <p className="text-sm text-center text-gray-600 mb-4">Choose bundle, enter payer and recipient numbers, then confirm payment.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {bundles.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBundle(b)}
              className={`p-3 rounded-lg border text-left transition ${
                selectedBundle?.id === b.id
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-white border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex justify-between">
                <span className="font-medium">{b.name}</span>
                <span className="font-semibold">Ksh {b.price}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm text-gray-700">Number to Pay (payer)</label>
            <input
              type="tel"
              placeholder="e.g. 2547XXXXXXXX or 07XXXXXXXX"
              value={normalizeDisplay(payer)}
              onChange={(e) => setPayer(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg"
            />
            <p className="text-xs text-gray-400 mt-1">This number will receive the MPESA prompt to pay.</p>
          </div>

          <div>
            <label className="block text-sm text-gray-700">Number to Receive Bundle (recipient)</label>
            <input
              type="tel"
              placeholder="e.g. 2547XXXXXXXX or 07XXXXXXXX"
              value={normalizeDisplay(recipient)}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg"
            />
            <p className="text-xs text-gray-400 mt-1">Bundle will be delivered to this number after payment confirmation.</p>
          </div>
        </div>

        <button
          onClick={submitOrder}
          disabled={sending}
          className="w-full mt-4 py-3 bg-green-600 text-white rounded-lg font-semibold disabled:opacity-60"
        >
          {sending ? "Sending STK..." : `Pay Ksh ${selectedBundle ? selectedBundle.price : "—"}`}
        </button>

        {message && (
          <div className="mt-3 p-3 rounded-md bg-blue-50 text-sm text-blue-800">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
