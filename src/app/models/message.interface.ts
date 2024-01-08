import { ProductInterface } from './product.interface';

export interface MessageInterface {
  sender: string;
  content: string;
  productsInfo?: ProductInterface[];
}
