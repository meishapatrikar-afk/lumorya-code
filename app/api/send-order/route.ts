import { NextResponse } from 'next/server';
import { handleNewOrder } from '@/lib/email';

export async function POST(req: Request) {
  try {
    console.log("🔥 API HI");

    const order = await req.json();
    console.log("📦 Order received:", order?.id);

    const result = await handleNewOrder(order);

    console.log("📧 Email result:", result);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ API ERROR:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}