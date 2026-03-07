import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyUPIPayment } from '@/lib/upiVerification';

export async function POST(req: NextRequest) {
  try {
    const { transactionId, amount } = await req.json();

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID required' },
        { status: 400 }
      );
    }

    const verificationResult = await verifyUPIPayment(transactionId, amount);

    if (verificationResult.success) {
      const client = await clientPromise;
      const db = client.db('donations');

      const result = await db.collection('donors').updateOne(
        { transactionId: transactionId },
        {
          $set: {
            verified: true,
            verifiedAt: new Date(),
            utr: verificationResult.utr,
          }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'Transaction not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Payment verification failed'
      });
    }

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}