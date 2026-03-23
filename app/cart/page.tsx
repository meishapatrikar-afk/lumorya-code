'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/app/providers';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    router.push('/checkout');
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-8">Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <ShoppingCart size={64} className="mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Start shopping and add some premium candles to your cart
              </p>
              <Link href="/products">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex gap-4 p-6 ${index !== items.length - 1 ? 'border-b border-border' : ''}`}
                    >
                      {/* Image */}
                      <div className="w-24 h-24 flex-shrink-0 bg-secondary rounded overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground text-lg mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{item.scent}</p>
                        <div className="flex gap-4">
                          <span className="text-xs bg-secondary px-2 py-1 rounded">{item.size}</span>
                          <span className="text-xs bg-secondary px-2 py-1 rounded">{item.burnTime}h</span>
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="text-right">
                        <p className="font-bold text-primary text-lg mb-4">
                          ₹{(item.price * item.cartQuantity).toLocaleString()}
                        </p>

                        {/* Quantity Selector */}
                        <div className="flex items-center border border-border rounded mb-4">
                          <button
                            className="px-2 py-1 text-foreground hover:bg-background"
                            onClick={() =>
                              updateQuantity(item.id, Math.max(1, item.cartQuantity - 1))
                            }
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 py-1 text-foreground">{item.cartQuantity}</span>
                          <button
                            className="px-2 py-1 text-foreground hover:bg-background"
                            onClick={() =>
                              updateQuantity(item.id, Math.min(item.quantity, item.cartQuantity + 1))
                            }
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          className="text-destructive hover:text-destructive/80 transition flex items-center gap-1 text-sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div className="mt-6">
                  <Link href="/products">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-secondary rounded-lg p-6 sticky top-20">
                  <h2 className="font-bold text-foreground text-lg mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-foreground">
                      <span>Subtotal</span>
                      <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-foreground">
                      <span>Shipping</span>
                      <span className="text-primary font-semibold">Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-foreground">
                      <span>Tax</span>
                      <span className="text-primary font-semibold">Calculated at checkout</span>
                    </div>
                    <div className="border-t border-border pt-4 flex justify-between font-bold text-foreground text-lg">
                      <span>Estimated Total</span>
                      <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mb-4"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full text-destructive hover:text-destructive"
                    onClick={() => {
                      if (confirm('Clear your entire cart?')) {
                        clearCart();
                      }
                    }}
                  >
                    Clear Cart
                  </Button>

                  {/* Promo Code */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <Input placeholder="Enter code" className="text-sm" />
                      <Button variant="outline" size="sm">
                        Apply
                      </Button>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mt-6 pt-6 border-t border-border space-y-3">
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>✓</span>
                      <span>100% Natural soy wax</span>
                    </div>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>✓</span>
                      <span>Handcrafted with care</span>
                    </div>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>✓</span>
                      <span>Eco-friendly packaging</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
