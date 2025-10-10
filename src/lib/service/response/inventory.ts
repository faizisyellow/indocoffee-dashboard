import type { Beans, Forms } from "../../store";

export type CreateProductResponse = {
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
