'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-primary-foreground mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-sm flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-bold text-lg">✧</span>
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold">Lumorya</h2>
                <p className="text-xs font-light opacity-75 tracking-wide">Luxury Candles</p>
              </div>
            </div>
            <p className="text-sm font-light opacity-80 mt-4">
              Handcrafted scented candles designed to illuminate your moments and create unforgettable ambiance in your home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-bold text-base mb-6 text-white">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm font-light opacity-80 hover:opacity-100 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm font-light opacity-80 hover:opacity-100 transition">
                  Shop Candles
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm font-light opacity-80 hover:opacity-100 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-sm font-light opacity-80 hover:opacity-100 transition">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-serif font-bold text-base mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm font-light opacity-80 hover:opacity-100 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm font-light opacity-80 hover:opacity-100 transition">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm font-light opacity-80 hover:opacity-100 transition">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm font-light opacity-80 hover:opacity-100 transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif font-bold text-base mb-6 text-white">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail size={18} className="flex-shrink-0 mt-0.5 opacity-75" strokeWidth={1.5} />
                <a href="mailto:hello@lumorya.com" className="text-sm font-light opacity-80 hover:opacity-100 transition break-all">
                  hello@lumorya.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="flex-shrink-0 mt-0.5 opacity-75" strokeWidth={1.5} />
                <a href="tel:+919876543210" className="text-sm font-light opacity-80 hover:opacity-100 transition">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="flex-shrink-0 mt-0.5 opacity-75" strokeWidth={1.5} />
                <address className="text-sm font-light opacity-80 not-italic">
                  Nagpur, Maharashtra, India
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 my-12"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm font-light opacity-75">
          <p>&copy; {currentYear} Lumorya. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/" className="hover:opacity-100 transition">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:opacity-100 transition">
              Terms of Service
            </Link>
            <div className="flex gap-4">
              <a href="#" className="hover:opacity-100 transition">Instagram</a>
              <a href="#" className="hover:opacity-100 transition">Facebook</a>
              <a href="#" className="hover:opacity-100 transition">Twitter</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
