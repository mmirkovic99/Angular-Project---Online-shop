import { ProductInCartInterface } from './cartState.interface';
import { ProductInterface } from './product.interface';

export interface OrderInterface {
  id: number;
  products: Array<ProductInCartInterface>;
  totalPrice: number;
  time: Date;
}

export type OrderProductRow = {
  orderID: number;
  productInCart: ProductInCartInterface;
  time: Date;
  totalPrice: number;
};
