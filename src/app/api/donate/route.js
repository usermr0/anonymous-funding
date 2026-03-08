import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { amount, name, email } = await req.json();

    if (!amount || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate a transaction ID
    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substring(7);

    return NextResponse.json({
      success: true,
      transactionId,
      message: 'Donation initiated successfully'
    });

  } catch (error) {
    console.error('Donation error:', error);
    return NextResponse.json(
      { error: 'Failed to process donation' },
      { status: 500 }
    );
  }
}