import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET: Fetch verified donors (unchanged)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('donations');

    const donors = await db
      .collection('donors')
      .find({ verified: true })
      .sort({ date: -1 })
      .toArray();

    const serializedDonors = donors.map(donor => ({
      id: donor._id.toString(),
      name: donor.name,
      amount: donor.amount,
      date: donor.date,
      phone: donor.phone || null,
    }));

    return NextResponse.json(serializedDonors);
  } catch (error) {
    console.error('Error fetching donors:', error);
    return NextResponse.json([]);
  }
}

// POST: Save a new donation (updated for Razorpay)
export async function POST(req) {
  try {
    const {
      name,
      phone,
      email,
      amount,
      transactionId,
      razorpay_order_id,
      razorpay_signature
    } = await req.json();

    // Validate required fields
    if (!name || !amount || !transactionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('donations');

    const result = await db.collection('donors').insertOne({
      name,
      phone: phone || null,
      email: email || null,
      amount: Number(amount),
      transactionId,                // Razorpay payment ID
      razorpay_order_id,             // Razorpay order ID
      razorpay_signature,            // Razorpay signature
      date: new Date().toISOString().split('T')[0],
      verified: true,                // Automatically verified via Razorpay
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      message: 'Donation recorded successfully!'
    });
  } catch (error) {
    console.error('Error saving donor:', error);
    return NextResponse.json(
      { error: 'Failed to save donation' },
      { status: 500 }
    );
  }
}