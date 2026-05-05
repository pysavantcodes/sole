import { apiRequest } from "./operators";
import type { CartResponse } from "./types";

export interface AddToCartInput {
  product_id: string;
  quantity?: number;
  variant_id?: string;
}

export const cartAPI = {
  getCart: () =>
    apiRequest<CartResponse>({
      url: "/cart",
      method: "GET",
    }),

  addToCart: (payload: AddToCartInput) =>
    apiRequest<CartResponse>({
      url: "/cart/add",
      method: "POST",
      data: payload,
    }),

  updateCartItem: (itemId: string, quantity: number) =>
    apiRequest<CartResponse>({
      url: `/cart/items/${itemId}`,
      method: "PATCH",
      data: { quantity },
    }),

  removeCartItem: (itemId: string) =>
    apiRequest<CartResponse>({
      url: `/cart/items/${itemId}`,
      method: "DELETE",
    }),

  clearCart: () =>
    apiRequest<CartResponse>({
      url: "/cart/clear",
      method: "DELETE",
    }),
};
