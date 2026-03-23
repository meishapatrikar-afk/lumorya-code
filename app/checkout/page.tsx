'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/app/providers';
import { getShippingRates, ShiprocketRate } from '@/lib/shiprocket';
import { saveOrder } from '@/lib/storage';
import { handleNewOrder } from '@/lib/email';
import { Order } from '@/lib/types';
import { ArrowLeft, Truck, CreditCard } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [shippingAddress, setShippingAddress] = useState({
    phone: '',
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  const [shippingRates, setShippingRates] = useState<ShiprocketRate[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShiprocketRate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const fetchShippingRates = async () => {
    try {
      setLoading(true);
      const rates = await getShippingRates({
        pickup_postcode: '110001', // Seller's postcode
        delivery_postcode: shippingAddress.zipCode || '110001',
        weight: items.reduce((sum, item) => sum + item.weight * item.cartQuantity, 0),
        cod: 0,
      });
      setShippingRates(rates);
      if (rates.length > 0) {
        setSelectedShipping(rates[0]);
      }
    } catch (err) {
      setError('Failed to fetch shipping rates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
    
    // Fetch shipping rates when zipcode is entered
    if (name === 'zipCode' && value.length >= 6) {
      fetchShippingRatesForZipcode(value);
    }
  };

  const fetchShippingRatesForZipcode = async (zipCode: string) => {
    try {
      setLoading(true);
      setError('');
      const rates = await getShippingRates({
        pickup_postcode: '440001', // Nagpur postcode (default seller location)
        delivery_postcode: zipCode,
        weight: items.reduce((sum, item) => sum + item.weight * item.cartQuantity, 0),
        cod: 0,
      });
      setShippingRates(rates);
      if (rates.length > 0) {
        setSelectedShipping(rates[0]);
      }
    } catch (err) {
      setError('Failed to fetch shipping rates. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToPayment = () => {
    if (
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode
    ) {
      setError('Please fill in all shipping details');
      return;
    }

    // Only require shipping method if rates were fetched
    if (shippingRates.length > 0 && !selectedShipping) {
      setError('Please select a shipping method');
      return;
    }

    setError('');
    setStep('payment');
  };

  const handleTestPayment = async () => {
    try {
      setLoading(true);
      setError('');

      if (!shippingAddress.firstName || !shippingAddress.email || !shippingAddress.phone || !shippingAddress.address) {
        setError('Please fill in all required fields');
        return;
      }

      const shippingCost = selectedShipping?.rate || 0;
      const finalTotal = totalPrice + shippingCost;

      // Create order in Shiprocket (non-blocking but log errors)
      let shipmentId = null;
      try {
        console.log('[v0] Sending order to Shiprocket...');
        const shiprocketResponse = await fetch('/api/shiprocket/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: `order_${Date.now()}`,
            orderDate: new Date().toISOString(),
            customerName: shippingAddress.firstName,
            customerEmail: shippingAddress.email,
            customerPhone: shippingAddress.phone,
            address: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state,
            zipCode: shippingAddress.zipCode,
            items: items,
            totalAmount: finalTotal,
          }),
        });

        const shiprocketData = await shiprocketResponse.json();
        console.log('[v0] Shiprocket response:', shiprocketData);

        if (shiprocketResponse.ok && shiprocketData.success) {
          shipmentId = shiprocketData.shipmentId;
          console.log('[v0] Order sent to Shiprocket successfully, shipment:', shipmentId);
        } else {
          console.warn('[v0] Shiprocket warning:', shiprocketData.error || 'Order not created');
        }
      } catch (error) {
        console.error('[v0] Shiprocket error (non-blocking):', error);
      }

      // Create order
      const order: Order = {
        id: `ORD-${Date.now()}`,
        userId: `guest_${Date.now()}`,
        items: items,
        totalAmount: finalTotal,
        status: 'confirmed',
        paymentStatus: 'completed',
        paymentMethod: 'Test Payment',
        paymentId: `TEST-${Date.now()}`,
        razorpayOrderId: undefined,
        shipmentId: shipmentId || undefined,
        shippingAddress: shippingAddress,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      saveOrder(order);
      
      // Send confirmation emails (non-blocking)
      try {
        await handleNewOrder(order);
      } catch (error) {
        console.error('[v0] Email notification error:', error);
      }
      
      clearCart();
      router.push(`/order-confirmation/${order.id}`);
    } catch (err) {
      setError('Payment processing failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    try {
      setLoading(true);
      setError('');

      if (!shippingAddress.firstName || !shippingAddress.email || !shippingAddress.phone || !shippingAddress.address) {
        setError('Please fill in all required fields');
        return;
      }

      const shippingCost = selectedShipping?.rate || 0;
      const finalTotal = totalPrice + shippingCost;

      // Create Razorpay order via API
      const razorpayResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotal,
          orderId: `order_${Date.now()}`,
        }),
      });

      if (!razorpayResponse.ok) {
        const errorData = await razorpayResponse.json();
        throw new Error(errorData.error || 'Failed to create Razorpay order');
      }

      const razorpayOrder = await razorpayResponse.json();

      // Open Razorpay payment modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: Math.round(finalTotal * 100), // Amount in paise
        currency: 'INR',
        name: 'Lumorya Candles',
        description: `Order for ${items.length} item(s)`,
        order_id: razorpayOrder.id,
        customer_notif: 1,
        handler: async function (response: any) {
          try {
            // Payment successful, now create the order
            // Create order in Shiprocket for shipping (optional, non-blocking)
            let shipmentId = null;
            try {
              const shiprocketResponse = await fetch('/api/shiprocket/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: `order_${Date.now()}`,
                  orderDate: new Date().toISOString(),
                  customerName: shippingAddress.firstName,
                  customerEmail: shippingAddress.email,
                  customerPhone: shippingAddress.phone,
                  address: shippingAddress.address,
                  city: shippingAddress.city,
                  state: shippingAddress.state,
                  zipCode: shippingAddress.zipCode,
                  items: items,
                  totalAmount: finalTotal,
                }),
              });

              if (shiprocketResponse.ok) {
                const shiprocketData = await shiprocketResponse.json();
                shipmentId = shiprocketData.success ? shiprocketData.shipmentId : null;
              }
            } catch (error) {
              console.error('Shiprocket error (non-blocking):', error);
            }

            // Create order with guest checkout
            const order: Order = {
              id: `ORD-${Date.now()}`,
              userId: `guest_${Date.now()}`,
              items: items,
              totalAmount: finalTotal,
              status: 'confirmed',
              paymentStatus: 'completed',
              paymentMethod: 'Razorpay',
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              shipmentId: shipmentId || undefined,
              shippingAddress: shippingAddress,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            saveOrder(order);
            
            // Send confirmation emails (non-blocking)
            try {
              await handleNewOrder(order);
            } catch (error) {
              console.error('[v0] Email notification error:', error);
            }
            
            clearCart();
            router.push(`/order-confirmation/${order.id}`);
          } catch (err) {
            setError('Failed to save order. Please try again.');
            console.error('Order creation error:', err);
          }
        },
        prefill: {
          name: shippingAddress.firstName,
          email: shippingAddress.email,
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#8B7355',
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          setError(`Payment failed: ${response.error.description}`);
          setLoading(false);
        });
        rzp.open();
        setLoading(false);
      } else {
        setError('Razorpay payment gateway is not available');
        setLoading(false);
      }
    } catch (err) {
      setError('Payment processing failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/cart" className="text-primary hover:underline">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-4xl font-bold text-foreground">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Checkout */}
            <div className="lg:col-span-2">
              {/* Step Indicator */}
              <div className="flex gap-4 mb-8">
                <div
                  className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition ${
                    step === 'shipping'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                  onClick={() => setStep('shipping')}
                >
                  <div className="flex items-center gap-2">
                    <Truck size={20} className={step === 'shipping' ? 'text-primary' : 'text-muted-foreground'} />
                    <span className="font-semibold text-foreground">Shipping</span>
                  </div>
                </div>

                <div
                  className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition ${
                    step === 'payment'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                  onClick={() => step === 'payment' && setStep('payment')}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard size={20} className={step === 'payment' ? 'text-primary' : 'text-muted-foreground'} />
                    <span className="font-semibold text-foreground">Payment</span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              {/* Shipping Step */}
              {step === 'shipping' && (
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">Shipping Address</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        First Name *
                      </label>
                      <Input
                        value={shippingAddress.firstName}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                        }
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Last Name *
                      </label>
                      <Input
                        value={shippingAddress.lastName}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                        }
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, email: e.target.value })
                      }
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number *
                    </label>
                    <Input
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleShippingChange}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Address *
                    </label>
                    <Input
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleShippingChange}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        City *
                      </label>
                      <Input
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleShippingChange}
                        placeholder="Delhi"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        State *
                      </label>
                      <Input
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleShippingChange}
                        placeholder="Delhi"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Postal Code *
                      </label>
                      <Input
                        name="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={handleShippingChange}
                        placeholder="110001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={shippingAddress.country}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                      >
                        <option value="India">India</option>
                      </select>
                    </div>
                  </div>

                  {/* Shipping Methods */}
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-4">Shipping Methods</h3>
                    {loading ? (
                      <p className="text-muted-foreground">Loading shipping options...</p>
                    ) : shippingRates.length === 0 ? (
                      <p className="text-muted-foreground bg-yellow-50 border border-yellow-200 p-4 rounded">
                        Enter your postal code above to see available shipping options.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {shippingRates.map((rate) => (
                          <label
                            key={rate.id}
                            className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition"
                          >
                            <input
                              type="radio"
                              name="shipping"
                              checked={selectedShipping?.id === rate.id}
                              onChange={() => setSelectedShipping(rate)}
                              className="mr-4"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">{rate.courier_name}</p>
                              <p className="text-sm text-muted-foreground">{rate.etd_label}</p>
                            </div>
                            <span className="font-bold text-primary">₹{rate.rate}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={handleContinueToPayment}
                    disabled={loading}
                  >
                    Continue to Payment
                  </Button>
                </div>
              )}

              {/* Payment Step */}
              {step === 'payment' && (
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">Payment Method</h2>

                  <div className="space-y-4">
                    {/* Test Payment Option */}
                    <div className="border border-green-200 bg-green-50 p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <input 
                          type="radio" 
                          id="test" 
                          name="payment"
                          checked={paymentMethod === 'test'}
                          onChange={() => setPaymentMethod('test')}
                          className="mr-3" 
                        />
                        <label htmlFor="test" className="font-semibold text-foreground cursor-pointer flex-1">
                          Test Payment (For Testing Only)
                        </label>
                      </div>
                      <p className="text-sm text-muted-foreground ml-7">
                        Complete a test order instantly without payment processing. Perfect for testing the full checkout flow.
                      </p>
                    </div>

                    {/* Razorpay Payment Option */}
                    <div className="bg-secondary p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <input 
                          type="radio" 
                          id="razorpay" 
                          name="payment"
                          checked={paymentMethod === 'razorpay'}
                          onChange={() => setPaymentMethod('razorpay')}
                          className="mr-3" 
                        />
                        <label htmlFor="razorpay" className="font-semibold text-foreground cursor-pointer flex-1">
                          Razorpay (Credit/Debit Card, UPI, Wallets)
                        </label>
                      </div>
                      <p className="text-sm text-muted-foreground ml-7">
                        Pay securely using Razorpay. Supports all major payment methods.
                      </p>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={paymentMethod === 'test' ? handleTestPayment : handleProcessPayment}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : (paymentMethod === 'test' ? 'Complete Test Order' : 'Complete Purchase')}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setStep('shipping')}
                    disabled={loading}
                  >
                    Back to Shipping
                  </Button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-secondary rounded-lg p-6 sticky top-20">
                <h2 className="font-bold text-foreground text-lg mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-foreground">
                        {item.name} x {item.cartQuantity}
                      </span>
                      <span className="font-semibold text-foreground">
                        ₹{(item.price * item.cartQuantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  {selectedShipping && (
                    <div className="flex justify-between text-foreground">
                      <span>Shipping ({selectedShipping.courier_name})</span>
                      <span>₹{selectedShipping.rate}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t border-border pt-3">
                    <span>Total</span>
                    <span className="text-primary">
                      ₹{(totalPrice + (selectedShipping?.rate || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
