// Razorpay Integration

export async function createRazorpayOrder(amount: number, orderId: string) {
  const res = await fetch('/api/razorpay/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      orderId,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to create Razorpay order');
  }

  return res.json();
}

export async function openRazorpayCheckout(
  amount: number,
  orderId: string,
  user: {
    name: string;
    email: string;
    contact: string;
  }
) {
  const order = await createRazorpayOrder(amount, orderId);

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // 💥 important
    amount: order.amount,
    currency: 'INR',
    name: 'Lumorya',
    description: 'Order Payment',
    order_id: order.id, // 💥 CRITICAL
    handler: function (response: any) {
      console.log('Payment success:', response);

      // 👉 You can trigger success flow here
      window.location.href = `/order-confirmation/${orderId}`;
    },
    prefill: {
      name: user.name,
      email: user.email,
      contact: user.contact,
    },
    theme: {
      color: '#000000',
    },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
}
