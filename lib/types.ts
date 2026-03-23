// Application Types

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  scent: string;
  size: string;
  weight: number;
  burnTime: number;
  inStock: boolean;
  quantity: number;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "completed" | "failed";
  paymentMethod: string;
  paymentId?: string;
  razorpayOrderId?: string;
  shippingAddress: User;
  createdAt: Date;
  updatedAt: Date;
  shiprocketOrderId?: string;
}

export interface ShippingRate {
  id: string;
  courier: string;
  deliveryDays: number;
  amount: number;
  etaInDays: number;
}
