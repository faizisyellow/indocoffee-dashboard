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

export interface Bean {
  id: string;
  name: string;
}

export interface Form {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  bean: string;
  roasted: string;
  form: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string;
  productDetails: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: "Paid" | "Processing" | "Shipped" | "Delivered";
  createdAt: string;
  currentStep: number;
  totalSteps: number;
}

class DataStore {
  private beans: Bean[] = [
    { id: "1", name: "Robusta" },
    { id: "2", name: "Arabica" },
  ];

  private forms: Form[] = [
    { id: "1", name: "Whole coffee bean" },
    { id: "2", name: "Ground coffee" },
  ];

  private products: Product[] = [
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

  private orders: Order[] = [
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

  getBeans(): Bean[] {
    return [...this.beans];
  }

  addBean(bean: Omit<Bean, "id">): Bean {
    const newBean = { ...bean, id: Date.now().toString() };
    this.beans.push(newBean);
    return newBean;
  }

  updateBean(id: string, bean: Partial<Bean>): Bean | null {
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

  getForms(): Form[] {
    return [...this.forms];
  }

  addForm(form: Omit<Form, "id">): Form {
    const newForm = { ...form, id: Date.now().toString() };
    this.forms.push(newForm);
    return newForm;
  }

  updateForm(id: string, form: Partial<Form>): Form | null {
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

  getProducts(): Product[] {
    return [...this.products];
  }

  getProduct(id: string): Product | null {
    return this.products.find((p) => p.id === id) || null;
  }

  addProduct(product: Omit<Product, "id">): Product {
    const newProduct = { ...product, id: Date.now().toString() };
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: string, product: Partial<Product>): Product | null {
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

  getOrders(): Order[] {
    return [...this.orders];
  }

  getOrder(id: string): Order | null {
    return this.orders.find((o) => o.id === id) || null;
  }

  addOrder(order: Omit<Order, "id">): Order {
    const newOrder = { ...order, id: Date.now().toString() };
    this.orders.push(newOrder);
    return newOrder;
  }

  updateOrder(id: string, order: Partial<Order>): Order | null {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index !== -1) {
      this.orders[index] = { ...this.orders[index], ...order };
      return this.orders[index];
    }
    return null;
  }

  updateOrderStep(id: string, step: number): Order | null {
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
