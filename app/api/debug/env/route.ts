import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const email = process.env.SHIPROCKET_API_EMAIL;
    const password = process.env.SHIPROCKET_API_PASSWORD;

    return NextResponse.json({
      status: 'debug',
      email_set: !!email,
      email_value: email ? '***hidden***' : 'NOT SET',
      password_set: !!password,
      password_value: password ? '***hidden***' : 'NOT SET',
      razorpay_key_set: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      node_env: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
