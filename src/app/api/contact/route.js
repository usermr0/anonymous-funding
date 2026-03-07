import { NextResponse } from 'next/server';
import freelyEmail from 'freely-email';

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

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Send email using FreelyEmail - completely anonymous!
    const emailData = {
      recipient: "[user9mrzero@gmail.com]", // Replace with YOUR email where you want to receive messages
      app: "Mr Zero's Portfolio",
      replyTo: email, // So you can reply directly to the sender
      subject: `🔔 New Message from ${name} via Portfolio`,
      sender: "MrZero-Portfolio", // This becomes [email protected]
      message: `
================================
NEW CONTACT FORM SUBMISSION
================================

Name: ${name}
Email: ${email}
Time: ${new Date().toLocaleString()}

Message:
${message}

================================
You can reply directly to: ${email}
================================
      `,
    };

    const result = await freelyEmail.sendEmail(emailData);
    console.log('Email sent successfully:', result);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}