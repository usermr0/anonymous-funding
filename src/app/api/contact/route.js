import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Log the message (you'll see this in Vercel logs)
    console.log('========== NEW CONTACT FORM ==========');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    console.log('Time:', new Date().toISOString());
    console.log('======================================');

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