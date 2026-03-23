'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Order } from '@/lib/types';
import { getAllOrders } from '@/lib/storage';
import { CheckCircle, Package, MapPin, CreditCard } from 'lucide-react';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const orders = getAllOrders();
  const foundOrder = orders.find((o) => o.id === orderId);

  setOrder(foundOrder || null);
  setLoading(false);

  if (foundOrder) {
    fetch('/api/send-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(foundOrder),
    })
      .then(res => res.json())
      .then(data => console.log('✅ Email trigger:', data))
      .catch(err => console.error('❌ Error:', err));
  }
}, [orderId]);
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-foreground">Loading order details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Order Not Found</h1>
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <CheckCircle size={80} className="text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Order Confirmed!</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            <div className="bg-secondary p-4 rounded-lg inline-block">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="text-2xl font-bold text-foreground">{order.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Order Details */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Package size={24} />
                Order Details
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Order Date</span>
                  <span className="font-semibold text-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Order Status</span>
                  <span className="font-semibold text-green-600 bg-green-50 px-3 py-1 rounded text-sm">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Payment Status</span>
                  <span className="font-semibold text-green-600 bg-green-50 px-3 py-1 rounded text-sm">
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-semibold text-foreground">{order.paymentMethod}</span>
                </div>

                <div className="bg-secondary p-4 rounded-lg mt-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-primary">₹{order.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MapPin size={24} />
                Shipping Address
              </h2>

              <div className="space-y-3 text-foreground">
                <div>
                  <p className="font-semibold">{order.shippingAddress.name}</p>
                  <p className="text-muted-foreground">{order.shippingAddress.email}</p>
                </div>

                <div className="border-t border-border pt-3">
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-muted-foreground">Phone:</p>
                  <p className="font-semibold">{order.shippingAddress.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Items Ordered</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-secondary rounded">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-border rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.scent}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.cartQuantity} × ₹{item.price}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-primary">
                    ₹{(item.price * item.cartQuantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-blue-900 mb-4">What's Next?</h3>
            <ul className="space-y-2 text-blue-900 text-sm">
              <li>✓ We've received your order and are preparing it for shipment</li>
              <li>✓ You'll receive a shipping confirmation email with tracking details</li>
              <li>✓ Your order will be shipped within 1-2 business days</li>
              <li>✓ Track your package using the tracking link in your email</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/orders" className="flex-1">
              <Button variant="outline" className="w-full">
                View My Orders
              </Button>
            </Link>
            <Link href="/products" className="flex-1">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-center text-muted-foreground mb-4">
              Questions about your order?
            </p>
            <p className="text-center text-foreground">
              Contact us at <span className="font-semibold">hello@lumorya.com</span> or call{' '}
              <span className="font-semibold">+1 (555) 123-4567</span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
