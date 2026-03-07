'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

// Create a separate component that uses useSearchParams
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === 'undefined') return;

    const verifyPayment = async () => {
      const transactionId = searchParams.get('txnId');
      const amount = searchParams.get('amount');

      if (!transactionId) {
        setStatus('failed');
        setMessage('No transaction ID found');
        return;
      }

      try {
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transactionId,
            amount: amount ? parseInt(amount) : null
          }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage('Payment verified! Your name has been added to the donor list.');
          setTimeout(() => router.push('/'), 3000);
        } else {
          setStatus('failed');
          setMessage('Payment verification failed. Please contact support.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('failed');
        setMessage('Error verifying payment. Please try again.');
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-xl border border-gray-100">
        {status === 'verifying' && (
          <>
            <Loader className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-medium text-gray-900 mb-4">Verifying Payment</h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-medium text-gray-900 mb-4">Thank You!</h1>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-400">Redirecting to home page...</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-medium text-gray-900 mb-4">Verification Failed</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800"
            >
              Return Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}