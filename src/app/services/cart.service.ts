import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  CartStateInterface,
  ProductInCartInterface,
} from '../models/cartState.interface';
import { ProductInterface } from '../models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartSubject = new BehaviorSubject<CartStateInterface>({
    products: [],
  });
  readonly cart$ = this.cartSubject.asObservable();

  private productsCart: ProductInCartInterface[] = [];

  constructor() {}

  getCart(): Observable<CartStateInterface> {
    return this.cart$;
  }

  addToCart(product: ProductInCartInterface): void {
    this.productsCart.push(product);
    this.cartSubject.next({ products: this.productsCart });
  }

  removeFromCart(index: number): void {
    this.productsCart = this.productsCart.filter(
      (_: ProductInCartInterface, i: number) => i !== index
    );
    this.cartSubject.next({ products: this.productsCart });
  }
}
