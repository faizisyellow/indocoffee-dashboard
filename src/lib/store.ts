export type Login = {
  token: string;
  user: {
    id: number;
    email: string;
    role_name: string;
  };
};

export type User = {
  email: string;
  username: string;
  isActive: boolean;
  createdAt: string;
};

export type Bean = {
  id: number;
  name: string;
};

export type Beans = Bean[];

export type Form = {
  id: number;
  name: string;
};

export type Forms = Form[];

export type Product = {
  id: number;
  roasted: string;
  bean_id: number;
  bean: {
    name: string;
  };
  form_id: number;
  form: {
    name: string;
  };
  price: number;
  quantity: number;
  image: string;
};

export type Products = Product[];

export type OrderStatus =
  | "confirm"
  | "cancelled"
  | "roasting"
  | "shipped"
  | "complete";

export type Order = {
  alternative_phone_number: string;
  city: string;
  created_at: string;
  customer_email: string;
  customer_name: string;
  id: string;
  items: OrderItem[];
  phone_number: string;
  status: string;
  street: string;
  total_price: number;
};

export type Orders = Order[];

export type OrderItem = {
  bean_name: string;
  form_name: string;
  id: number;
  image: string;
  order_quantity: number;
  price: number;
  roasted: string;
};
