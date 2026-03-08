import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();

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

export async function POST(req) {
  try {
    const { name, phone, amount, transactionId } = await req.json();
    const db = await getDb();

    const result = await db.collection('donors').insertOne({
      name,
      phone: phone || null,
      amount: Number(amount),
      transactionId,
      date: new Date().toISOString().split('T')[0],
      verified: false,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      message: 'Donation recorded. Will be displayed after verification.'
    });
  } catch (error) {
    console.error('Error saving donor:', error);
    return NextResponse.json(
      { error: 'Failed to save donation' },
      { status: 500 }
    );
  }
}