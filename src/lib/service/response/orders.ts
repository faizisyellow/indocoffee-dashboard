import type { Orders } from "../../store";

export type GetOrdersResponse = {
  data: Orders;
  error: string;
};
