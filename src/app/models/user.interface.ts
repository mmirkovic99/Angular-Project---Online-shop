import { ProductInterface } from './product.interface';

export interface UserInterface {
  id: number;
  name: string;
  surname: string;
  email: string;
  username: string;
  password: string;
  orders: any[];
  favorites: Array<ProductInterface>;
}
