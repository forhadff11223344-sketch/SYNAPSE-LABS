/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CategoryType = 'all' | 'streaming' | 'vpn' | 'games' | 'gift' | 'educational';

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
  subcategory: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  description: string;
  features: string[];
  deliveryTime: string;
  image: string;
  duration?: string;
  instructions: string[];
  specs?: Record<string, string>;
  preloadedKeys?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  keys: string[]; // Delivered keys/accounts
}

export interface Order {
  id: string;
  date: string;
  email: string;
  items: OrderItem[];
  total: number;
  paymentMethod: 'card' | 'crypto' | 'gpay' | 'bkash' | 'nagad';
  status: 'completed' | 'processing';
}

export interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface GatewaySettings {
  bkashNumber: string;
  nagadNumber: string;
  whatsappNumber: string;
  discordLink: string;
  facebookUrl: string;
}

