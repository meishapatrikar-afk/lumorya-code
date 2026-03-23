import { Order } from '@/lib/types';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'contact@lumorya.in';   // use your existing mailbox
const ADMIN_EMAIL = 'meishapatrikar@gmail.com';  // same inbox for admin notifications

async function sendEmail(payload: any) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('[Email] Failed:', error);
    return false;
  }

  const data = await response.json();
  console.log('[Email] Sent:', data.id);
  return true;
}

export async function handleNewOrder(order: Order) {
  if (!RESEND_API_KEY) {
    console.error('[Email] RESEND_API_KEY not configured');
    return false;
  }

  const itemsList = order.items
    .map((item: any) => `- ${item.name} (Qty: ${item.cartQuantity}) - ₹${(item.price * item.cartQuantity).toFixed(2)}`)
    .join('\n');

  // Customer confirmation email
  const customerEmailBody = `
Dear ${order.shippingAddress.firstName},

Thank you for your order! Here are your order details:

Order ID: ${order.id}
Order Date: ${new Date(order.createdAt).toLocaleDateString()}
Payment Status: ${order.paymentStatus}

Items:
${itemsList}

Shipping Address:
${order.shippingAddress.firstName}
${order.shippingAddress.address}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
Phone: ${order.shippingAddress.phone}

Order Total: ₹${order.totalAmount.toFixed(2)}

We will notify you once your order is shipped.

Best regards,
Lumorya Candles Team
  `.trim();

  await sendEmail({
    from: FROM_EMAIL,
    to: order.shippingAddress.email, // customer email
    subject: `Order Confirmation - ${order.id}`,
    text: customerEmailBody,
  });

  // Admin notification email
  const adminEmailBody = `
NEW ORDER RECEIVED

Order ID: ${order.id}
Customer: ${order.shippingAddress.firstName}
Email: ${order.shippingAddress.email}
Phone: ${order.shippingAddress.phone}

Items:
${itemsList}

Shipping Address:
${order.shippingAddress.address}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}

TOTAL: ₹${order.totalAmount.toFixed(2)}
Payment: ${order.paymentStatus}
  `.trim();

  await sendEmail({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL, // your admin inbox
    subject: `[NEW ORDER] ${order.id} - ${order.shippingAddress.firstName}`,
    text: adminEmailBody,
  });

  return true;
}
