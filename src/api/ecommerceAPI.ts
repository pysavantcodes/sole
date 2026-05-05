import { apiRequest } from "./operators";

export interface SolePodConfig {
  id: number;
  title: string;
  subtitle?: string;
  starting_price: string | number;
  currency: string;
  unit_limit?: number;
  pod_types?: unknown[];
  finishes?: unknown[];
  scents?: unknown[];
  add_ons?: unknown[];
}

export interface CreatePaymentLinkInput {
  pod_type_id: string;
  variant_id: string;
  scent_id: string;
  sole_card_name: string;
  add_on_ids?: string[];
  shipping_address: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  use_shipping_as_billing?: boolean;
  payment_method?: string;
  metadata?: Record<string, string>;
}

export const ecommerceAPI = {
  getSolePodConfig: () =>
    apiRequest<{ status: string; data: SolePodConfig }>({
      url: "/ecommerce/sole-pod",
      method: "GET",
    }),

  createPaymentLink: (payload: CreatePaymentLinkInput) =>
    apiRequest<{
      status: string;
      id: string;
      url: string;
      reservation: unknown;
    }>({
      url: "/ecommerce/sole-pod/payment-link",
      method: "POST",
      data: payload,
    }),
};
