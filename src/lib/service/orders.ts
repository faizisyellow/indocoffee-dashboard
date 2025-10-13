import type { AxiosInstance } from "axios";
import type { Order, Orders, OrderStatus } from "../store";
import { clientWithAuth } from "./axios/axios";
import type {
  GetOrderDetailResponse,
  GetOrdersResponse,
  UpdateStatusOrderResponse,
} from "./response/orders";

class OrdersService {
  axios: AxiosInstance;
  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  async GetOrders(
    status?: OrderStatus,
    sort: "asc" | "desc" = "asc",
    offset?: number,
    limit?: number,
  ): Promise<Orders> {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (sort) params.append("sort", sort);
    if (offset) params.append("offset", offset.toString());
    if (limit) params.append("limit", limit.toString());

    const queryString = params.toString();
    const url = queryString ? `orders?${queryString}` : "orders/";

    const response = await this.axios.get<GetOrdersResponse>(url);

    return response.data.data;
  }

  async GetOrder(id: string): Promise<Order> {
    const response = await this.axios.get<GetOrderDetailResponse>(
      `orders/${id}`,
    );
    return response.data.data;
  }

  async UpdateStatusOrder(id: string, status: OrderStatus): Promise<string> {
    const nextState =
      status == "roasting"
        ? "roast"
        : status == "shipped"
          ? "ship"
          : "complete";

    const response = await this.axios.patch<UpdateStatusOrderResponse>(
      `orders/${id}/${nextState}`,
    );
    return response.data.data;
  }
}

export const ordersService = new OrdersService(clientWithAuth);
