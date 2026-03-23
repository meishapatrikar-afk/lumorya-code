// Razorpay Integration

export async function createRazorpayOrder(amount: number, orderId: string) {
  // Production implementation with real Razorpay API
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(process.env.RAZORPAY_KEY_ID + ':' + process.env.RAZORPAY_KEY_SECRET)}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: orderId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create Razorpay order');
  }

  return response.json();
}

export async function verifyRazorpayPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) {
  // Verify payment signature with Razorpay
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (expectedSignature === razorpaySignature) {
    return {
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpayPaymentId,
    };
  }

  return {
    success: false,
    message: 'Payment verification failed',
    paymentId: razorpayPaymentId,
  };
}
