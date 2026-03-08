import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
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

    // For now, just return success
    // You can add email sending later with a service like SendGrid
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