import type { Bean, Beans, Form, Forms, Product, Products } from "../../store";

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

export type GetBeanResponse = {
  data: Bean;
  error: string;
};

export type EditBeanResponse = {
  data: string;
  error: string;
};

export type GetFormsResponse = {
  data: Forms;
  error: string;
};

export type GetFormResponse = {
  data: Form;
  error: string;
};

export type EditFormResponse = {
  data: string;
  error: string;
};
