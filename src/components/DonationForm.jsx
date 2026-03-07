'use client';

import { useState } from 'react';
import { CheckCircle, Smartphone, Loader } from 'lucide-react';

// Simple functions instead of importing from lib
const generateTransactionId = () => {
  return 'TXN' + Date.now() + Math.random().toString(36).substring(7).toUpperCase();
};

const createUPILink = (upiId, name, amount, transactionId) => {
  const params = new URLSearchParams({
    pa: upiId,
    pn: name,
    am: amount.toString(),
    cu: 'INR',
    tn: transactionId,
  });

  return `upi://pay?${params.toString()}`;
};

export default function DonationForm({ onDonationSubmitted, upiId, businessName }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  const presetAmounts = [500, 1000, 2500, 5000];

  const handleAmountSelect = (value) => {
    setAmount(value.toString());
    setCustomAmount('');
  };

  const handleCustomAmount = (e) => {
    setCustomAmount(e.target.value);
    setAmount('');
  };

  const handlePayNow = async () => {
    const donationAmount = parseInt(amount || customAmount);
    if (!donationAmount || donationAmount <= 0) {
      setError('Please select an amount first');
      return;
    }

    if (!name) {
      setError('Please enter your name');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const transactionId = generateTransactionId();

      // Save pending donation
      const saveResponse = await fetch('/api/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone: phone || undefined,
          amount: donationAmount,
          transactionId,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save donation record');
      }

      setShowVerification(true);

      // Open UPI app
      const upiLink = createUPILink(upiId, businessName, donationAmount, transactionId);
      window.location.href = upiLink;

    } catch (err) {
      setError(err.message || 'Something went wrong');
      setIsProcessing(false);
    }
  };

  if (showVerification) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-24 text-center">
        <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">Waiting for Payment</h3>
        <p className="text-gray-600 mb-4">
          Please complete the payment in your UPI app.
        </p>
        <p className="text-sm text-gray-400 mb-6">
          Amount: ₹{(parseInt(amount || customAmount) || 0).toLocaleString('en-IN')}
        </p>
        <button
          onClick={() => {
            setShowVerification(false);
            setIsProcessing(false);
          }}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-24">
      <h2 className="text-2xl font-medium text-gray-900 mb-6">Make a Contribution</h2>

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-xl flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Donation recorded! It will appear after verification.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name <span className="text-red-500">*</span>
            <span className="text-gray-400 ml-2">(will be shown publicly)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        {/* Phone Number Input (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-gray-400">(optional)</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">
            Your phone number will remain private. Only used to appreciate you in my good time.
          </p>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        {/* Amount Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Amount (₹) <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleAmountSelect(preset)}
                className={`py-3 px-4 rounded-xl border transition-all ${
                  amount === preset.toString()
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 text-gray-700 hover:border-gray-400'
                }`}
              >
                ₹{preset.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={handleCustomAmount}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
        </div>

        {/* Pay Now Button */}
        <button
          type="button"
          onClick={handlePayNow}
          disabled={isProcessing || !name || (!amount && !customAmount)}
          className="w-full py-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Smartphone className="w-5 h-5" />
              Pay ₹{(parseInt(amount || customAmount) || 0).toLocaleString('en-IN')} via UPI
            </>
          )}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Click to pay with Google Pay, PhonePe, or any UPI app. Your name will appear automatically after payment.
        </p>
      </form>
    </div>
  );
}