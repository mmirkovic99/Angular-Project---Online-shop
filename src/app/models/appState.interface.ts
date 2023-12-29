import { CartStateInterface } from './cartState.interface';
import { UserInterface } from './user.interface';

export interface AppStateInterface {
  user: UserInterface;
  cart: CartStateInterface;
  error: string;
}
