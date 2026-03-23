'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { mockProducts } from '@/lib/mockData';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/app/providers';
import { ShoppingCart, ArrowLeft, Star } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = mockProducts.find((p) => p.id === productId);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`Added ${quantity} x ${product.name} to cart!`);
  };

  const relatedProducts = mockProducts.filter(
    (p) => p.scent === product.scent && p.id !== product.id
  ).slice(0, 4);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <Link href="/products" className="inline-flex items-center text-primary hover:underline mb-6">
            <ArrowLeft size={16} className="mr-2" />
            Back to Products
          </Link>

          {/* Product Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Image */}
            <div className="bg-secondary rounded-lg overflow-hidden h-96 md:h-full">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <p className="text-sm text-primary font-semibold mb-2">{product.scent}</p>
                <h1 className="text-4xl font-bold text-foreground mb-2">{product.name}</h1>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-muted-foreground text-sm">(148 reviews)</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="font-bold text-foreground mb-3">Specifications</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-foreground">Size:</span>
                    <span className="font-semibold text-foreground">{product.size}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-foreground">Weight:</span>
                    <span className="font-semibold text-foreground">{product.weight}kg</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-foreground">Burn Time:</span>
                    <span className="font-semibold text-foreground">~{product.burnTime} hours</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-foreground">Stock:</span>
                    <span className={`font-semibold ${product.inStock ? 'text-green-600' : 'text-destructive'}`}>
                      {product.inStock ? `${product.quantity} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold text-primary">Rs. {product.price}</span>
                  <span className="text-sm text-muted-foreground">Including all taxes</span>
                </div>

                <div className="space-y-4">
                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center border border-border rounded">
                      <button
                        className="px-4 py-2 text-foreground hover:bg-muted"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        −
                      </button>
                      <Input
                        type="number"
                        min="1"
                        max={product.quantity}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="flex-1 border-none text-center"
                      />
                      <button
                        className="px-4 py-2 text-foreground hover:bg-muted"
                        onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart size={20} />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">You Might Also Like</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((related) => (
                  <Link key={related.id} href={`/products/${related.id}`}>
                    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full">
                      <div className="relative w-full h-48 bg-secondary overflow-hidden">
                        <img
                          src={related.image}
                          alt={related.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-foreground mb-1 line-clamp-2">{related.name}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{related.scent}</p>
                        <span className="text-lg font-bold text-primary">₹{related.price}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
