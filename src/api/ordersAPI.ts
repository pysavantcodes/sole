import { apiRequest } from "./operators";

export interface UserOrder {
  id: number;
  reservation_number: string;
  pod_type: string;
  finish: string;
  scent: string;
  sole_card_name: string;
  subtotal_amount: string;
  tax_amount: string;
  delivery_amount: string;
  total_amount: string;
  status: string;
  delivery_status: string;
}

export const ordersAPI = {
  getUserOrders: (perPage = 10) =>
    apiRequest<{
      status: string;
      data: {
        orders: UserOrder[];
        total_page: number;
      };
    }>({
      url: "/ecommerce/sole-pod/orders",
      method: "GET",
      params: { per_page: perPage },
    }),
};
