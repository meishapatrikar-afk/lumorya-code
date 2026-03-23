'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/lib/mockData';
import { ArrowRight, Flame, Leaf, Gift, Star, Clock } from 'lucide-react';

export default function Home() {
  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-accent text-sm font-medium tracking-widest uppercase">Handcrafted in Nagpur</p>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-tight">
                  Illuminate Your <span className="text-primary">Moments</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                  Discover our collection of premium scented candles, carefully crafted to transform your home into a sanctuary of warmth and elegance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-8 py-6 text-base">
                    Shop Collection
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="rounded-none px-8 py-6 text-base border-2">
                    Our Story
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-muted-foreground"><strong className="text-foreground">4.9/5</strong> Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">100% Natural Soy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">45h+ Burn Time</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="/images/candles/vanilla-dreams.jpg" 
                    alt="Vanilla Dreams Candle" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="/images/candles/lavender-bliss.jpg" 
                    alt="Lavender Bliss Candle" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="/images/candles/rose-garden.jpg" 
                    alt="Rose Garden Candle" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="/images/candles/sandalwood-serenity.jpg" 
                    alt="Sandalwood Serenity Candle" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-primary/5 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <Flame className="w-8 h-8 text-primary mx-auto" />
              <p className="font-semibold text-foreground">100% Natural Soy</p>
              <p className="text-sm text-muted-foreground">Pure ingredients only</p>
            </div>
            <div className="text-center space-y-2">
              <Leaf className="w-8 h-8 text-primary mx-auto" />
              <p className="font-semibold text-foreground">Eco-Friendly</p>
              <p className="text-sm text-muted-foreground">Sustainable packaging</p>
            </div>
            <div className="text-center space-y-2">
              <Gift className="w-8 h-8 text-primary mx-auto" />
              <p className="font-semibold text-foreground">Gift Ready</p>
              <p className="text-sm text-muted-foreground">Beautiful packaging</p>
            </div>
            <div className="text-center space-y-2">
              <Clock className="w-8 h-8 text-primary mx-auto" />
              <p className="font-semibold text-foreground">Long Burn Time</p>
              <p className="text-sm text-muted-foreground">45+ hours of fragrance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <p className="text-primary text-sm font-medium tracking-widest uppercase">Best Sellers</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              Featured Candles
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our most beloved scents, curated to bring moments of peace and luxury to your everyday life.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="group cursor-pointer h-full bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative overflow-hidden aspect-square">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                        {product.scent}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xl font-bold text-primary">
                        Rs. {product.price}
                      </span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {product.burnTime}h burn
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Link href="/products">
              <Button size="lg" className="rounded-none px-8">
                View All Products
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section with Image */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-lg overflow-hidden">
                  <img 
                    src="/images/candles/cinnamon-spice.jpg" 
                    alt="Cinnamon Spice Candle" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="aspect-[3/4] rounded-lg overflow-hidden">
                  <img 
                    src="/images/candles/eucalyptus-mint.jpg" 
                    alt="Eucalyptus Mint Candle" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-primary text-sm font-medium tracking-widest uppercase">Our Craft</p>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                  Handcrafted with Love
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Every Lumorya candle is carefully handcrafted in small batches in Nagpur, Maharashtra. We use only 100% natural soy wax and premium fragrance oils to ensure a clean, long-lasting burn that fills your space with beautiful aromas.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Natural Ingredients</h4>
                  <p className="text-sm text-muted-foreground">Pure soy wax and essential oils</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Long Burn Time</h4>
                  <p className="text-sm text-muted-foreground">45+ hours of fragrance</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Hand Poured</h4>
                  <p className="text-sm text-muted-foreground">Small batch production</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Eco Packaging</h4>
                  <p className="text-sm text-muted-foreground">Recyclable materials</p>
                </div>
              </div>

              <Link href="/about">
                <Button variant="outline" size="lg" className="rounded-none border-2">
                  Learn More About Us
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold">
            Ready to Transform Your Space?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join hundreds of satisfied customers across India who have discovered the Lumorya experience. Shop our premium handcrafted candles today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-white hover:bg-white/90 text-primary rounded-none px-8 py-6 text-base font-semibold">
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
