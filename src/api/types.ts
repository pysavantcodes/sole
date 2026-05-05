export interface ApiEnvelope<T> {
  status: string;
  message?: string;
  data?: T;
}

export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[] | string>;
}

export interface User {
  id: number;
  name: string;
  username?: string | null;
  email: string;
  phone?: string | null;
  image?: string | null;
  points?: number;
  shipping_address?: unknown;
  billing_address?: unknown;
  tier?: number;
}

export interface AuthPayload {
  status: string;
  message: string;
  user: User;
  token: string;
}

export interface CartItem {
  id: string | number;
  name: string;
  description?: string;
  image_url?: string;
  price: number;
  quantity: number;
}

export interface CartResponse {
  status: string;
  message?: string;
  data: {
    items: CartItem[];
    subtotal?: number;
    total?: number;
    currency?: string;
  };
}
