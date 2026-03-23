'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Heart, Leaf, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-background">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6">About Lumorya</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the story behind our premium handcrafted scented candles
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                At Lumorya, we believe that every home deserves a touch of luxury and elegance. Our mission is to
                create premium scented candles that transform spaces and elevate everyday moments.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We are committed to using only the finest natural ingredients, sustainable practices, and ethical
                sourcing to create candles that are as good for your home as they are for the planet.
              </p>
            </div>
            <div className="bg-secondary rounded-lg h-64 flex items-center justify-center">
              <Heart size={120} className="text-primary/30" />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 bg-secondary/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <Leaf size={48} className="text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-3">Sustainability</h3>
                <p className="text-muted-foreground">
                  We use eco-friendly materials and sustainable practices to minimize our environmental impact.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <Award size={48} className="text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-3">Quality</h3>
                <p className="text-muted-foreground">
                  Every candle is handcrafted with premium ingredients and tested for perfection.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <Heart size={48} className="text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-3">Customer Care</h3>
                <p className="text-muted-foreground">
                  Your satisfaction is our priority. We are always here to help with any questions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Our Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold text-lg">1</span>
                </div>
                <h3 className="font-bold text-foreground mb-2">Source</h3>
                <p className="text-sm text-muted-foreground">
                  We carefully source premium natural ingredients from ethical suppliers worldwide.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold text-lg">2</span>
                </div>
                <h3 className="font-bold text-foreground mb-2">Craft</h3>
                <p className="text-sm text-muted-foreground">
                  Each candle is hand-poured and crafted with precision and care by our artisans.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold text-lg">3</span>
                </div>
                <h3 className="font-bold text-foreground mb-2">Test</h3>
                <p className="text-sm text-muted-foreground">
                  Every batch is rigorously tested for quality, scent throw, and burn time.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold text-lg">4</span>
                </div>
                <h3 className="font-bold text-foreground mb-2">Deliver</h3>
                <p className="text-sm text-muted-foreground">
                  Beautifully packaged and shipped to your door with care and reliability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Experience Lumorya?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of satisfied customers who have transformed their spaces with our premium candles.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Shop Our Collection
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
