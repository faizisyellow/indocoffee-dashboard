import type { AxiosInstance } from "axios";
import { clientWithAuth } from "./axios/axios";
import type {
  CreateProductResponse,
  EditProductResponse,
  GetBeansResponse,
  GetFormsResponse,
  GetProductResponse,
  GetProductsResponse,
} from "./response/inventory";
import type { Beans, Forms, Product, Products } from "../store";

class InventoryService {
  axios: AxiosInstance;
  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  async createProduct(newProduct: FormData): Promise<string> {
    const result = await this.axios.post<CreateProductResponse>(
      "products",
      newProduct,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return result.data?.data;
  }

  async GetProducts(
    bean?: string,
    form?: string,
    roasted?: string,
    sort?: "asc" | "desc",
    offset?: number,
    limit?: number,
  ): Promise<Products> {
    const params = new URLSearchParams();
    if (bean) params.append("bean", bean);
    if (form) params.append("form", form);
    if (roasted) params.append("roast", roasted);
    if (sort) params.append("sort", sort);
    if (offset !== undefined) params.append("offset", offset.toString());
    if (limit !== undefined) params.append("limit", limit.toString());

    const queryString = params.toString();
    const url = queryString ? `products?${queryString}` : "products/";

    const result = await this.axios.get<GetProductsResponse>(url);
    return result.data?.data;
  }

  async GetProduct(id: number): Promise<Product> {
    const result = await this.axios.get<GetProductResponse>(`products/${id}`);
    return result.data?.data;
  }

  async DeleteProduct(id: number) {
    await this.axios.delete(`products/${id}`);
  }

  async EditProduct(formData: FormData, productId: number): Promise<string> {
    const result = await this.axios.patch<EditProductResponse>(
      `products/${productId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
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
