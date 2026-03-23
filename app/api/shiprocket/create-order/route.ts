import { NextRequest, NextResponse } from 'next/server';

const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';

let cachedAuthToken: string | null = null;
let tokenExpiryTime: number = 0;

async function getAuthToken(): Promise<string | null> {
  try {
    const SHIPROCKET_EMAIL = process.env.SHIPROCKET_API_EMAIL;
    const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_API_PASSWORD;

    if (!SHIPROCKET_EMAIL || !SHIPROCKET_PASSWORD) {
      console.error('❌ Shiprocket credentials missing');
      return null;
    }

    // Use cached token if valid
    if (cachedAuthToken && Date.now() < tokenExpiryTime) {
      return cachedAuthToken;
    }

    console.log('🔐 Authenticating with Shiprocket...');

    const response = await fetch(`${SHIPROCKET_API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: SHIPROCKET_EMAIL,
        password: SHIPROCKET_PASSWORD,
      }),
    });

    if (!response.ok) {
      console.error('❌ Shiprocket auth failed:', response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.token) {
      cachedAuthToken = data.token;
      tokenExpiryTime = Date.now() + 23 * 60 * 60 * 1000; // 23 hours
      console.log('✅ Shiprocket auth success');
      return data.token;
    }

    console.error('❌ No token received');
    return null;
  } catch (error) {
    console.error('❌ Auth error:', error);
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
      return NextResponse.json(
        {
          success: false,
          shipmentId: null,
          error: 'Shiprocket authentication failed',
        },
        { status: 500 }
      );
    }

    // 🔥 CORRECT PAYLOAD
    const shiprocketPayload = {
      order_id: orderId,
      order_date: orderDate,
      pickup_location: "Primary",

      // Billing
      billing_customer_name: customerName,
      billing_last_name: "",
      billing_address: address,
      billing_address_2: "",
      billing_city: city,
      billing_pincode: zipCode,
      billing_state: state,
      billing_country: "India",
      billing_email: customerEmail,
      billing_phone: customerPhone,

      // Shipping
      shipping_is_billing: true,
      shipping_customer_name: customerName,
      shipping_address: address,
      shipping_city: city,
      shipping_pincode: zipCode,
      shipping_state: state,
      shipping_country: "India",
      shipping_email: customerEmail,
      shipping_phone: customerPhone,

      // Items
      order_items: items.map((item: any) => ({
        name: item.name,
        sku: item.id || `SKU-${item.name}`,
        units: item.cartQuantity,
        selling_price: item.price,
      })),

      payment_method: "Prepaid",
      sub_total: totalAmount,

      // Package details
      length: 10,
      breadth: 10,
      height: 10,
      weight: items.reduce(
        (sum: number, item: any) =>
          sum + (item.weight || 0.5) * item.cartQuantity,
        0
      ),
    };

    console.log('📦 Creating Shiprocket order:', shiprocketPayload);

    const response = await fetch(`${SHIPROCKET_API_BASE}/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(shiprocketPayload),
    });

    const data = await response.json();

    console.log('📡 Shiprocket response:', data);

    if (response.ok && data?.shipment_id) {
      console.log('✅ Order created in Shiprocket:', data.shipment_id);

      return NextResponse.json({
        success: true,
        shipmentId: data.shipment_id,
        orderId: data.order_id,
        status: 'created',
      });
    }

    console.error('❌ Shiprocket API error:', data);

    return NextResponse.json(
      {
        success: false,
        shipmentId: null,
        error: data?.message || 'Failed to create order',
      },
      { status: 500 }
    );
  } catch (error) {
    console.error('❌ Internal error:', error);

    return NextResponse.json(
      {
        success: false,
        shipmentId: null,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
