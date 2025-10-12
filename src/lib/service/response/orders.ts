import type { Order, Orders } from "../../store";

export type GetOrdersResponse = {
  data: Orders;
  error: string;
};

export type GetOrderDetailResponse = {
  data: Order;
  error: string;
};

export type UpdateStatusOrderResponse = {
  data: string;
  error: string;
};
