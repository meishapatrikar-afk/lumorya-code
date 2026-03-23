import { User, Order } from "./types";

const AUTH_KEY = "candlestore_auth";
const CART_KEY = "candlestore_cart";
const ORDERS_KEY = "candlestore_orders";

// Auth utilities
export const getSessionUser = (): User | null => {
  if (typeof window === "undefined") return null;
  try {
    const auth = sessionStorage.getItem(AUTH_KEY);
    return auth ? JSON.parse(auth) : null;
  } catch {
    return null;
  }
};

export const setSessionUser = (user: User): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
};

export const clearSessionUser = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUTH_KEY);
};

export const getUserByEmail = (email: string): User | null => {
  if (typeof window === "undefined") return null;
  const users = JSON.parse(sessionStorage.getItem("candlestore_users") || "{}");
  return users[email] || null;
};

export const registerUser = (email: string, password: string, name: string): User | null => {
  if (typeof window === "undefined") return null;
  
  const users = JSON.parse(sessionStorage.getItem("candlestore_users") || "{}");
  
  if (users[email]) {
    return null; // User already exists
  }

  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  };

  // Store password hash (in real app, use proper hashing)
  const credentials = JSON.parse(sessionStorage.getItem("candlestore_credentials") || "{}");
  credentials[email] = password;
  sessionStorage.setItem("candlestore_credentials", JSON.stringify(credentials));

  users[email] = newUser;
  sessionStorage.setItem("candlestore_users", JSON.stringify(users));
  
  return newUser;
};

export const loginUser = (email: string, password: string): User | null => {
  if (typeof window === "undefined") return null;
  
  const credentials = JSON.parse(sessionStorage.getItem("candlestore_credentials") || "{}");
  
  if (credentials[email] === password) {
    const users = JSON.parse(sessionStorage.getItem("candlestore_users") || "{}");
    return users[email] || null;
  }

  return null;
};

// Cart utilities
export const getCart = (): any[] => {
  if (typeof window === "undefined") return [];
  try {
    const cart = sessionStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const setCart = (cart: any[]): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
};

// Order utilities
export const saveOrder = (order: Order): void => {
  if (typeof window === "undefined") return;
  try {
    const orders = JSON.parse(sessionStorage.getItem(ORDERS_KEY) || "[]");
    orders.push(order);
    sessionStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    console.error("Error saving order");
  }
};

export const getOrders = (userId: string): Order[] => {
  if (typeof window === "undefined") return [];
  try {
    const orders = JSON.parse(sessionStorage.getItem(ORDERS_KEY) || "[]");
    return orders.filter((order: Order) => order.userId === userId);
  } catch {
    return [];
  }
};

export const getAllOrders = (): Order[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(sessionStorage.getItem(ORDERS_KEY) || "[]");
  } catch {
    return [];
  }
};

export const updateOrder = (orderId: string, updates: Partial<Order>): void => {
  if (typeof window === "undefined") return;
  try {
    const orders = JSON.parse(sessionStorage.getItem(ORDERS_KEY) || "[]");
    const index = orders.findIndex((o: Order) => o.id === orderId);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      sessionStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  } catch {
    console.error("Error updating order");
  }
};
