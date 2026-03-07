// src/lib/upiVerification.ts
export async function verifyUPIPayment(transactionId: string, amount: number) {
  console.log(`Verifying payment: ${transactionId} for amount ₹${amount}`);

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // For demo: 80% success rate
  const isSuccess = Math.random() < 0.8;

  if (isSuccess) {
    return {
      success: true,
      status: 'SUCCESS',
      utr: 'UTR' + Math.random().toString(36).substring(7).toUpperCase(),
      amount: amount,
      transactionId: transactionId
    };
  } else {
    return {
      success: false,
      status: 'FAILED',
      message: 'Payment verification failed'
    };
  }
}

export function generateTransactionId() {
  return 'TXN' + Date.now() + Math.random().toString(36).substring(7).toUpperCase();
}

export function createUPILink(upiId: string, name: string, amount: number, transactionId: string) {
  const params = new URLSearchParams({
    pa: upiId,
    pn: name,
    am: amount.toString(),
    cu: 'INR',
    tn: transactionId,
  });

  return `upi://pay?${params.toString()}`;
}