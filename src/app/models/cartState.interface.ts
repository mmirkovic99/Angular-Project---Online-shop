import { ProductInterface } from './product.interface';

export interface CartStateInterface {
  products: ProductInCartInterface[];
}

export interface ProductInCartInterface {
  product: ProductInterface;
  quantity: number;
}
