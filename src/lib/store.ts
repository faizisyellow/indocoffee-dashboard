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

export type BeanMock = {
  id: string;
  name: string;
};
export type FormMock = {
  id: string;
  name: string;
};

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

export interface ProductMock {
  id: string;
  bean: string;
  roasted: string;
  form: string;
  price: number;
  quantity: number;
  image?: string;
}

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

export interface OrderItemMock {
  productId: string;
  productName: string;
  productImage?: string;
  productDetails: string;
  quantity: number;
  price: number;
}

export interface OrderMock {
  id: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
  customerAddress: string;
  items: OrderItemMock[];
  subtotal: number;
  shipping: number;
  total: number;
  status: "Paid" | "Processing" | "Shipped" | "Delivered";
  createdAt: string;
  currentStep: number;
  totalSteps: number;
}

class DataStore {
  private beans: BeanMock[] = [
    { id: "1", name: "Robusta" },
    { id: "2", name: "Arabica" },
  ];

  private forms: FormMock[] = [
    { id: "1", name: "Whole coffee bean" },
    { id: "2", name: "Ground coffee" },
  ];

  private products: ProductMock[] = [
    {
      id: "1",
      bean: "Robusta",
      roasted: "Medium",
      form: "whole coffee bean",
      price: 500,
      quantity: 100,
      image: "",
    },
  ];

  private orders: OrderMock[] = [
    {
      id: "1",
      orderId: "37dadas247asdas",
      customerEmail: "user@test.com",
      customerName: "user",
      customerAddress: "Somewhere\nDetail address",
      items: [
        {
          productId: "1",
          productName: "ARABICA",
          productImage: "",
          productDetails: "WHOLE COFFEE BEANS\nSIZE | 200G\nROAST | LIGHT",
          quantity: 2,
          price: 150,
        },
        {
          productId: "2",
          productName: "ARABICA",
          productImage: "",
          productDetails: "WHOLE COFFEE BEANS\nSIZE | 200G\nROAST | LIGHT",
          quantity: 1,
          price: 150,
        },
      ],
      subtotal: 599,
      shipping: 200,
      total: 799,
      status: "Paid",
      createdAt: "Aug 31 13:40",
      currentStep: 1,
      totalSteps: 4,
    },
  ];

  getBeans(): BeanMock[] {
    return [...this.beans];
  }

  addBean(bean: Omit<BeanMock, "id">): BeanMock {
    const newBean = { ...bean, id: Date.now().toString() };
    this.beans.push(newBean);
    return newBean;
  }

  updateBean(id: string, bean: Partial<BeanMock>): BeanMock | null {
    const index = this.beans.findIndex((b) => b.id === id);
    if (index !== -1) {
      this.beans[index] = { ...this.beans[index], ...bean };
      return this.beans[index];
    }
    return null;
  }

  deleteBean(id: string): boolean {
    const index = this.beans.findIndex((b) => b.id === id);
    if (index !== -1) {
      this.beans.splice(index, 1);
      return true;
    }
    return false;
  }

  getForms(): FormMock[] {
    return [...this.forms];
  }

  addForm(form: Omit<FormMock, "id">): FormMock {
    const newForm = { ...form, id: Date.now().toString() };
    this.forms.push(newForm);
    return newForm;
  }

  updateForm(id: string, form: Partial<FormMock>): FormMock | null {
    const index = this.forms.findIndex((f) => f.id === id);
    if (index !== -1) {
      this.forms[index] = { ...this.forms[index], ...form };
      return this.forms[index];
    }
    return null;
  }

  deleteForm(id: string): boolean {
    const index = this.forms.findIndex((f) => f.id === id);
    if (index !== -1) {
      this.forms.splice(index, 1);
      return true;
    }
    return false;
  }

  getProducts(): ProductMock[] {
    return [...this.products];
  }

  getProduct(id: string): ProductMock | null {
    return this.products.find((p) => p.id === id) || null;
  }

  addProduct(product: Omit<ProductMock, "id">): ProductMock {
    const newProduct = { ...product, id: Date.now().toString() };
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: string, product: Partial<ProductMock>): ProductMock | null {
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...product };
      return this.products[index];
    }
    return null;
  }

  deleteProduct(id: string): boolean {
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      return true;
    }
    return false;
  }

  getOrders(): OrderMock[] {
    return [...this.orders];
  }

  getOrder(id: string): OrderMock | null {
    return this.orders.find((o) => o.id === id) || null;
  }

  addOrder(order: Omit<OrderMock, "id">): OrderMock {
    const newOrder = { ...order, id: Date.now().toString() };
    this.orders.push(newOrder);
    return newOrder;
  }

  updateOrder(id: string, order: Partial<OrderMock>): OrderMock | null {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index !== -1) {
      this.orders[index] = { ...this.orders[index], ...order };
      return this.orders[index];
    }
    return null;
  }

  updateOrderStep(id: string, step: number): OrderMock | null {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index !== -1) {
      this.orders[index].currentStep = step;
      return this.orders[index];
    }
    return null;
  }

  deleteOrder(id: string): boolean {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index !== -1) {
      this.orders.splice(index, 1);
      return true;
    }
    return false;
  }
}

export const dataStore = new DataStore();
