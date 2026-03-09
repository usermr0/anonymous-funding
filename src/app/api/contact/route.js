import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get database connection
    const db = await getDb();

    // Insert message into 'messages' collection
    const result = await db.collection('messages').insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
      read: false, // optional, to mark as unread
    });

    console.log('✅ Message saved to database with ID:', result.insertedId);

    return NextResponse.json({
      success: true,
      message: 'Message received! I\'ll get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}