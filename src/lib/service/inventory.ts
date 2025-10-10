import type { AxiosInstance } from "axios";
import { clientWithAuth } from "./axios/axios";
import type {
  CreateProductResponse,
  GetBeansResponse,
  GetFormsResponse,
} from "./response/inventory";
import type { Beans, Forms } from "../store";

class InventoryService {
  axios: AxiosInstance;
  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  async createProduct(newProduct: FormData): Promise<string> {
    const result = await this.axios.post<CreateProductResponse>(
      "products",
      newProduct,
    );
    return result.data?.data;
  }

  async GetBeans(): Promise<Beans> {
    const result = await this.axios.get<GetBeansResponse>("beans");
    return result.data?.data;
  }

  async GetForms(): Promise<Forms> {
    const result = await this.axios.get<GetFormsResponse>("forms");
    return result.data?.data;
  }
}
export const inventoryService = new InventoryService(clientWithAuth);
