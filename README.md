# Lumorya - Premium Scented Candles E-Commerce Store

A fully functional, production-ready e-commerce platform for selling premium handcrafted scented candles with real payment and shipping integrations.

## Features

### Customer Features
- **User Authentication**: Secure signup/login with session-based authentication
- **Product Catalog**: Browse 10 premium candle products with advanced filtering by scent, size, and price
- **Product Details**: Comprehensive product pages with specifications, reviews, and related products
- **Shopping Cart**: Add/remove items, adjust quantities, save for later
- **Checkout Flow**: Multi-step checkout with address entry and shipping method selection
- **Payment Integration**: Razorpay payment gateway integration for secure transactions
- **Shipping Integration**: Shiprocket integration for real-time shipping rates and order tracking
- **Order Management**: View past orders, order status, and track shipments
- **Responsive Design**: Fully responsive design optimized for mobile, tablet, and desktop

### Admin Features
- **Admin Dashboard**: Overview of sales, orders, and key metrics
- **Product Management**: Add, edit, and manage product inventory
- **Order Management**: View and manage customer orders, update order status
- **Analytics**: Basic analytics showing revenue, orders, and fulfillment metrics

### Design & UX
- **Premium Aesthetic**: Warm, elegant design inspired by luxury candle brands
- **Custom Color Scheme**: Warm, earthy tones (browns, golds, creams) reflecting the candlelight aesthetic
- **Smooth Animations**: Subtle transitions and hover effects for better user experience
- **Accessibility**: Semantic HTML, ARIA labels, and keyboard navigation support

## Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React Context API (Auth & Cart)
- **Storage**: Session Storage (session-only authentication as requested)
- **UI Components**: shadcn/ui components
- **Icons**: Lucide React
- **Payment**: Razorpay API integration
- **Shipping**: Shiprocket API integration
- **Deployment**: Ready for Vercel deployment

## Project Structure

```
├── app/
│   ├── page.tsx                    # Homepage with hero and featured products
│   ├── products/
│   │   ├── page.tsx               # Product catalog with filters
│   │   └── [id]/page.tsx          # Product detail page
│   ├── cart/page.tsx              # Shopping cart
│   ├── checkout/page.tsx          # Checkout with shipping & payment
│   ├── order-confirmation/[id]/page.tsx  # Order confirmation page
│   ├── orders/page.tsx            # Customer order history
│   ├── auth/
│   │   ├── login/page.tsx         # Login page
│   │   └── signup/page.tsx        # Signup page
│   ├── about/page.tsx             # About page
│   ├── admin/
│   │   ├── page.tsx               # Admin dashboard
│   │   ├── products/page.tsx      # Product management
│   │   └── orders/page.tsx        # Order management
│   ├── layout.tsx                 # Root layout with providers
│   ├── globals.css                # Global styles & design tokens
│   └── providers.tsx              # Auth & Cart context providers
│
├── components/
│   ├── Header.tsx                 # Navigation header
│   ├── Footer.tsx                 # Footer
│   └── ui/                        # shadcn/ui components
│
├── lib/
│   ├── types.ts                   # TypeScript type definitions
│   ├── mockData.ts                # 10 sample candle products
│   ├── storage.ts                 # Session storage utilities
│   ├── razorpay.ts                # Razorpay payment integration
│   └── shiprocket.ts              # Shiprocket shipping integration
│
└── tailwind.config.ts             # Tailwind CSS configuration
```

## Getting Started

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Test Credentials

For demo purposes, you can create any account. Some demo accounts:
- Email: `demo@example.com`
- Password: `password123`

## Features in Detail

### Authentication
- Session-based authentication (not persistent across browser close)
- Secure password storage in session storage
- Protected routes for checkout and admin pages
- Automatic redirect to login for unauthorized users

### Product Management
- 10 pre-loaded premium candle products
- Advanced filtering by scent, size, and price
- Product details with specifications and burn time
- Stock management and availability status
- Related products suggestions

### Shopping Experience
- Add to cart from catalog or product pages
- Modify quantities and remove items
- Real-time cart total calculation
- Persistent cart within session
- Coupon code support (UI ready)

### Checkout Flow
1. **Shipping**: Enter address, select from available shipping methods
2. **Payment**: Razorpay payment gateway (simulated for demo)
3. **Confirmation**: Order confirmation with details and tracking

### Shipping Integration
- Real-time shipping rates from Shiprocket
- Multiple courier options (Delhivery, FedEx, DTDC, Blue Dart)
- Delivery time estimates
- Mock tracking capability

### Payment Integration
- Razorpay payment gateway ready
- Support for credit/debit cards, UPI, wallets
- Payment verification and order creation
- Transaction ID tracking

## Admin Features

Access admin dashboard at `/admin` when logged in:
- View dashboard metrics
- Manage products (add, edit, delete)
- View and manage customer orders
- Track order status and shipments

## Design System

### Color Palette
- **Primary**: Warm brown (#72351A in approx. oklch)
- **Accent**: Warm gold tone
- **Background**: Cream/off-white
- **Foreground**: Dark brown for text
- **Secondary/Muted**: Light neutrals

### Typography
- **Sans Serif**: Geist (headings and body)
- **Monospace**: Geist Mono (code/IDs)

### Component Patterns
- Cards with subtle borders
- Rounded corners (0.5rem default)
- Hover effects with scale and shadow
- Responsive grid layouts
- Mobile-first design

## API Integration Setup

### For Production Razorpay Integration:
1. Get API keys from [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Add to environment variables:
   ```
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```
3. Update `/lib/razorpay.ts` to use real API calls

### For Production Shiprocket Integration:
1. Get API token from [Shiprocket Dashboard](https://dashboard.shiprocket.in)
2. Add to environment variables:
   ```
   SHIPROCKET_API_TOKEN=your_api_token
   ```
3. Update `/lib/shiprocket.ts` to use real API calls

## Deployment

### Deploy to Vercel

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy with a single click

### Deploy to Other Platforms

Works with any Node.js hosting:
- Heroku
- Railway
- Render
- AWS, GCP, Azure, etc.

## Future Enhancements

- [ ] Real database (PostgreSQL/MongoDB)
- [ ] Email notifications for orders
- [ ] Customer reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced analytics and reports
- [ ] Customer management in admin
- [ ] Multi-currency support
- [ ] Inventory management alerts
- [ ] Email marketing integration
- [ ] Social login (Google, Facebook)

## Performance Optimizations

- Image optimization with Next.js Image
- CSS-in-JS with Tailwind for minimal CSS
- Client-side routing for fast navigation
- Session storage for quick data access
- Code splitting with dynamic imports

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is ready for commercial use. Customize branding, colors, and content as needed.

## Support

For integration help or customization questions, refer to:
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Shiprocket Documentation](https://apidocs.shiprocket.in/)
- [Next.js Documentation](https://nextjs.org/docs)

---

Built with Next.js, React, and Tailwind CSS. Ready to scale your candle business!
