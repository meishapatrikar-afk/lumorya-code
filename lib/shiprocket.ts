// Shiprocket Integration - Manual Order Creation

const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';

let cachedAuthToken: string | null = null;
let tokenExpiryTime: number = 0;

// Function to get authentication token
async function getAuthToken(): Promise<string | null> {
  try {
    // Read environment variables at runtime (not at module load)
    const SHIPROCKET_EMAIL = process.env.SHIPROCKET_API_EMAIL;
    const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_API_PASSWORD;

    if (!SHIPROCKET_EMAIL || !SHIPROCKET_PASSWORD) {
      console.error('[v0] Shiprocket credentials missing');
      console.error('[v0] Email:', SHIPROCKET_EMAIL ? '***set***' : 'NOT SET');
      console.error('[v0] Password:', SHIPROCKET_PASSWORD ? '***set***' : 'NOT SET');
      return null;
    }

    // Check if cached token is still valid (tokens expire after 24 hours)
    if (cachedAuthToken && Date.now() < tokenExpiryTime) {
      return cachedAuthToken;
    }

    console.log('[v0] Getting new Shiprocket auth token...');
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
      // Cache token for 23 hours
      tokenExpiryTime = Date.now() + (23 * 60 * 60 * 1000);
      console.log('[v0] Shiprocket auth token obtained successfully');
      return data.token;
    }

    console.error('[v0] No token in Shiprocket response:', data);
    return null;
  } catch (error) {
    console.error('[v0] Error getting Shiprocket auth token:', error);
    return null;
  }
}

export interface ShiprocketRateRequest {
  pickup_postcode: string;
  delivery_postcode: string;
  weight: number;
  cod: number;
}

export interface ShiprocketRate {
  id: string;
  courier_name: string;
  service_type: string;
  rate: number;
  etd: number;
  etd_label: string;
}

export async function getShippingRates(request: ShiprocketRateRequest): Promise<ShiprocketRate[]> {
  try {
    const authToken = await getAuthToken();
    
    if (!authToken) {
      return [];
    }

    const response = await fetch(`${SHIPROCKET_API_BASE}/courier/serviceability/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    // Transform Shiprocket response to our format
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((rate: any) => ({
        id: rate.courier_id?.toString() || rate.id,
        courier_name: rate.courier_name,
        service_type: rate.service_type || 'Standard',
        rate: rate.rate,
        etd: rate.etd || 3,
        etd_label: `${rate.etd || 3}-${(rate.etd || 3) + 1} days`,
      }));
    }

    return [];
  } catch (error) {
    return [];
  }
}

export interface ShiprocketOrderRequest {
  order_id: string;
  order_date: string;
  pickup_location: string;
  billing_customer_name: string;
  billing_last_name: string;
  billing_address: string;
  billing_address_2: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_bill: number;
  order_items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  payment_method: string;
  sub_total: number;
  length: number;
  breadth: number;
  height: number;
  weight: number;
}

export async function createShiprocketOrder(request: ShiprocketOrderRequest) {
  try {
    const authToken = await getAuthToken();
    
    if (!authToken) {
      console.error('[v0] Cannot create Shiprocket order - no auth token');
      throw new Error('Failed to authenticate with Shiprocket');
    }

    console.log('[v0] Creating manual order in Shiprocket:', {
      order_id: request.order_id,
      customer: request.customer_name,
    });

    const response = await fetch(`${SHIPROCKET_API_BASE}/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    console.log('[v0] Shiprocket response:', {
      status: response.status,
      ok: response.ok,
      message: data.message,
      success: data.status_code === 200,
    });

    if (response.ok && (data.status_code === 200 || data.data?.shipment_id)) {
      console.log('[v0] Order created in Shiprocket, shipment:', data.data?.shipment_id);
      return {
        status: 200,
        message: data.message || 'Order created',
        data: {
          shipment_id: data.data?.shipment_id,
          order_id: request.order_id,
          status: 'created',
        },
      };
    }

    console.error('[v0] Shiprocket error:', data);
    throw new Error(data.message || 'Failed to create order in Shiprocket');
  } catch (error) {
    console.error('[v0] Error creating Shiprocket order:', error);
    throw error;
  }
}

export async function getShiprocketOrderTracking(shipmentId: number) {
  try {
    const authToken = await getAuthToken();
    
    if (!authToken) {
      return null;
    }

    const response = await fetch(`${SHIPROCKET_API_BASE}/shipments/track/?shipment_id=${shipmentId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}
