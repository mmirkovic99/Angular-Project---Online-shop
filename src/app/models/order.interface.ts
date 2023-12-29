import { ProductInterface } from './product.interface';

export interface OrderInterface {
  id: number;
  products: Array<ProductInterface>;
  totalPrice: number;
}
