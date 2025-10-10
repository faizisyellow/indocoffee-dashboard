import type { Beans, Forms, Products } from "../../store";

export type CreateProductResponse = {
  data: string;
  error: string;
};

export type GetProductsResponse = {
  data: Products;
  error: string;
};

export type GetBeansResponse = {
  data: Beans;
  error: string;
};

export type GetFormsResponse = {
  data: Forms;
  error: string;
};
