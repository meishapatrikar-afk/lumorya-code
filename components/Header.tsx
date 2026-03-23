'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/app/providers';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, X } from 'lucide-react';

export function Header() {
  const { totalItems } = useCart() || { totalItems: 0 };
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-sm flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <span className="text-primary-foreground font-serif font-bold text-lg">✧</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-serif font-bold text-foreground tracking-widest">Lumorya</h1>
              <p className="text-xs text-muted-foreground font-light tracking-wide">Luxury Candles</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            <Link href="/" className="text-foreground hover:text-primary transition-colors text-sm font-light tracking-wide">
              Home
            </Link>
            <Link href="/products" className="text-foreground hover:text-primary transition-colors text-sm font-light tracking-wide">
              Products
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors text-sm font-light tracking-wide">
              About
            </Link>
          </nav>

          {/* Right side - Cart & Auth */}
          <div className="flex items-center space-x-6">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-foreground hover:text-primary transition-colors"
            >
              <ShoppingCart size={22} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-3 -right-3 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-foreground hover:text-primary transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="md:hidden pb-6 space-y-1 border-t border-border pt-4">
            <Link 
              href="/" 
              className="block text-foreground hover:text-primary hover:bg-muted px-3 py-3 rounded-lg transition text-base"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="block text-foreground hover:text-primary hover:bg-muted px-3 py-3 rounded-lg transition text-base"
              onClick={() => setMenuOpen(false)}
            >
              Shop All
            </Link>
            <Link 
              href="/about" 
              className="block text-foreground hover:text-primary hover:bg-muted px-3 py-3 rounded-lg transition text-base"
              onClick={() => setMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              href="/cart" 
              className="block text-foreground hover:text-primary hover:bg-muted px-3 py-3 rounded-lg transition text-base"
              onClick={() => setMenuOpen(false)}
            >
              Cart {totalItems > 0 && `(${totalItems})`}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
