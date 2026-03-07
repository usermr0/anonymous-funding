import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  console.log('========== API CALLED ==========');

  try {
    // Check if MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined');
      return NextResponse.json({ error: 'MongoDB URI not configured' }, { status: 500 });
    }

    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('Connected successfully');

    const db = client.db('donations');
    console.log('Using database: donations');

    // Check if collection exists
    const collections = await db.listCollections({ name: 'donors' }).toArray();
    console.log('Donors collection exists:', collections.length > 0);

    // If collection doesn't exist, create it
    if (collections.length === 0) {
      await db.createCollection('donors');
      console.log('Created donors collection');
    }

    const donors = await db
      .collection('donors')
      .find({})
      .toArray();

    console.log(`Found ${donors.length} donors total`);

    const serializedDonors = donors.map(donor => ({
      id: donor._id.toString(),
      name: donor.name,
      amount: donor.amount,
      date: donor.date,
      phone: donor.phone || null,
      verified: donor.verified || false
    }));

    console.log('Returning donors array of length:', serializedDonors.length);
    return NextResponse.json(serializedDonors);

  } catch (error) {
    console.error('ERROR in API route:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });

    // Return empty array instead of error object
    console.log('Returning empty array due to error');
    return NextResponse.json([]);
  }
}

export async function POST(req) {
  try {
    const { name, phone, amount, transactionId } = await req.json();

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