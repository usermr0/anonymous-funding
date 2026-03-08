import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export async function POST(req) {
  try {
    const { donorId, token } = await req.json();

    if (!ADMIN_TOKEN) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (token !== ADMIN_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!donorId) {
      return NextResponse.json(
        { error: 'Donor ID required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('donations');

    const result = await db.collection('donors').updateOne(
      { _id: new ObjectId(donorId) },
      { $set: { verified: true } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Donor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying donor:', error);
    return NextResponse.json(
      { error: 'Failed to verify donor' },
      { status: 500 }
    );
  }
}