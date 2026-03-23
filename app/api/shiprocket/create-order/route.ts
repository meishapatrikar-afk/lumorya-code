import { NextRequest, NextResponse } from 'next/server';

const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';

let cachedAuthToken: string | null = null;
let tokenExpiryTime: number = 0;

async function getAuthToken(): Promise<string | null> {
  try {
    // Read environment variables at RUNTIME, not module load time
    const SHIPROCKET_EMAIL = process.env.SHIPROCKET_API_EMAIL;
    const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_API_PASSWORD;

    if (!SHIPROCKET_EMAIL || !SHIPROCKET_PASSWORD) {
      console.error('[v0] Shiprocket auth failed - no email/password provided');
      return null;
    }

    if (cachedAuthToken && Date.now() < tokenExpiryTime) {
      return cachedAuthToken;
    }

    console.log('[v0] Authenticating with Shiprocket...');
    const response = await fetch(`${SHIPROCKET_API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: SHIPROCKET_EMAIL,
        password: SHIPROCKET_PASSWORD,
      }),
    });

    if (!response.ok) {
      console.error('[v0] Shiprocket auth failed:', response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.token) {
      cachedAuthToken = data.token;
      tokenExpiryTime = Date.now() + (23 * 60 * 60 * 1000);
      console.log('[v0] Shiprocket auth successful');
      return data.token;
    }

    console.error('[v0] No token received from Shiprocket');
    return null;
  } catch (error) {
    console.error('[v0] Shiprocket auth error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      orderDate,
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      state,
      zipCode,
      items,
      totalAmount,
    } = body;

    const authToken = await getAuthToken();

    if (!authToken) {
      console.error('[v0] Shiprocket auth failed - no email/password provided');
      return NextResponse.json({
        success: false,
        shipmentId: null,
        error: 'Shiprocket credentials not configured',
      }, { status: 500 });
    }

    const shiprocketPayload = {
      order_id: orderId,
      order_date: orderDate,
      pickup_location: 'Nagpur',
      billing_customer_name: customerName,
      billing_last_name: '',
      billing_address: address,
      billing_address_2: '',
      billing_city: city,
      billing_pincode: zipCode,
      billing_state: state,
      billing_country: 'India',
      billing_email: customerEmail,
      billing_phone: customerPhone,
      shipping_is_bill: 1,
      order_items: items.map((item: any) => ({
        name: item.name,
        quantity: item.cartQuantity,
        price: item.price,
      })),
      payment_method: 'Prepaid',
      sub_total: totalAmount,
      length: 10,
      breadth: 10,
      height: 10,
      weight: items.reduce((sum: number, item: any) => sum + (item.weight || 0.5) * item.cartQuantity, 0),
      channel_id: 10277489,
    };

    console.log('[v0] Creating Shiprocket order:', shiprocketPayload);

    const response = await fetch(`${SHIPROCKET_API_BASE}/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(shiprocketPayload),
    });

    const data = await response.json();
    console.log('[v0] Shiprocket response:', { status: response.status, ok: response.ok, data });

    if (response.ok && data.data?.shipment_id) {
      console.log('[v0] Order created successfully in Shiprocket:', data.data.shipment_id);
      return NextResponse.json({
        success: true,
        shipmentId: data.data.shipment_id,
        orderId: data.data.order_id,
        status: 'created',
      });
    }

    console.error('[v0] Shiprocket API error response:', data);
    console.error('[v0] Shiprocket error:', data.message || 'Failed to create order');
    return NextResponse.json({
      success: false,
      shipmentId: null,
      error: data.message || 'Failed to create order in Shiprocket',
    }, { status: 500 });
  } catch (error) {
    console.error('[v0] Shiprocket API error:', error);
    return NextResponse.json({
      success: false,
      shipmentId: null,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
