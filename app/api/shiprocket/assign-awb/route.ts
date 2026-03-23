import { NextRequest, NextResponse } from 'next/server';

const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';

async function getAuthToken() {
  const email = process.env.SHIPROCKET_API_EMAIL;
  const password = process.env.SHIPROCKET_API_PASSWORD;

  const res = await fetch(`${SHIPROCKET_API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  return data.token;
}

export async function POST(req: NextRequest) {
  try {
    const { shipmentId } = await req.json();

    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
    }

    // 🔥 Step 1: Get available couriers
    const courierRes = await fetch(
      `${SHIPROCKET_API_BASE}/courier/serviceability/?shipment_id=${shipmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const courierData = await courierRes.json();

    if (!courierData?.data?.available_courier_companies?.length) {
      return NextResponse.json({
        error: 'No courier available',
      }, { status: 400 });
    }

    // 🔥 Pick BEST courier (first one)
    const courierId =
      courierData.data.available_courier_companies[0].courier_company_id;

    // 🔥 Step 2: Assign courier (generate AWB)
    const assignRes = await fetch(
      `${SHIPROCKET_API_BASE}/courier/assign/awb`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shipment_id: shipmentId,
          courier_id: courierId,
        }),
      }
    );

    const assignData = await assignRes.json();

    return NextResponse.json({
      success: true,
      awb: assignData?.awb_code,
      courier: assignData?.courier_company_id,
      data: assignData,
    });

  } catch (error) {
    console.error('AWB Error:', error);

    return NextResponse.json(
      { error: 'Failed to assign courier' },
      { status: 500 }
    );
  }
}
