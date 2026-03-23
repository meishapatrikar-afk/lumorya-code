import { NextResponse } from 'next/server';

export async function GET() {
  const email = process.env.SHIPROCKET_API_EMAIL;
  const password = process.env.SHIPROCKET_API_PASSWORD;

  if (!email || !password) {
    return NextResponse.json({
      status: 'error',
      message: 'Shiprocket credentials not configured',
      email: email ? 'configured' : 'missing',
      password: password ? 'configured' : 'missing',
    });
  }

  try {
    const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      return NextResponse.json({
        status: 'success',
        message: 'Shiprocket authentication working',
        token: data.token.substring(0, 20) + '...',
      });
    }

    return NextResponse.json({
      status: 'error',
      message: 'Shiprocket authentication failed',
      response: data,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to authenticate',
      error: String(error),
    });
  }
}
