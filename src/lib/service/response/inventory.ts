import type { Beans, Forms, Product, Products } from "../../store";

export type CreateProductResponse = {
  data: string;
  error: string;
};

export type GetProductsResponse = {
  data: Products;
  error: string;
};

export type GetProductResponse = {
  data: Product;
  error: string;
};

export type EditProductResponse = {
  data: string;
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
