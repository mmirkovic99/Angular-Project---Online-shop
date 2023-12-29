import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as UserAction from '../../store/actions/UserActions';
import * as CartAction from '../../store/actions/CartActions';
import { AppStateInterface } from 'src/app/models/appState.interface';
import { ProductInterface } from 'src/app/models/product.interface';
import {
  productsSelector,
  productsTotalPriceSelector,
} from 'src/app/store/selectors/cartStateSelectors';
import {
  userIdSelector,
  userOrdersSelector,
} from 'src/app/store/selectors/userStateSelectors';
import { OrderInterface } from 'src/app/models/order.interface';
import { Router } from '@angular/router';
import { appStateSelect } from 'src/app/store/selectors/appStateSelectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  orders!: OrderInterface[];
  products!: ProductInterface[];
  userId!: number;
  totalPrica: number = 0;

  private userIdSubscription!: Subscription;
  private productsSubscription!: Subscription;
  private ordersSubscription!: Subscription;
  private totalPriceSubscription!: Subscription;

  constructor(private store: Store<AppStateInterface>, private router: Router) {
    this.setUserId();
    this.setOrders();
    this.setProducts();
    this.setTotalPrice();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  removeFromCart(index: number) {
    this.store.dispatch(CartAction.removeFromCart({ index }));
  }

  order() {
    if (this.userId === 0) this.router.navigate(['auth/login']);
    else {
      this.store.dispatch(
        UserAction.updateUserOrdes({
          id: this.userId,
          orders: [
            ...this.orders,
            {
              id: this.orders.length + 1,
              products: this.products,
              totalPrice: this.totalPrica,
            },
          ],
        })
      );
      this.store.dispatch(CartAction.removeAllFromCart());
    }
  }

  private setUserId() {
    this.userIdSubscription = this.store
      .pipe(select(userIdSelector))
      .subscribe((id: number) => {
        this.userId = id;
      });
  }

  private setOrders() {
    this,
      (this.ordersSubscription = this.store
        .pipe(select(userOrdersSelector))
        .subscribe((orders: OrderInterface[]) => {
          this.orders = orders;
        }));
  }

  private setProducts() {
    this.productsSubscription = this.store
      .pipe(select(productsSelector))
      .subscribe((products: any[]) => {
        this.products = products.map((product) => product);
      });
  }

  private setTotalPrice() {
    this.totalPriceSubscription = this.store
      .pipe(select(productsTotalPriceSelector))
      .subscribe((price: number) => {
        this.totalPrica = price;
      });
  }

  private unsubscribe() {
    this.userIdSubscription.unsubscribe();
    this.productsSubscription.unsubscribe();
    this.ordersSubscription.unsubscribe();
    this.totalPriceSubscription.unsubscribe();
  }
}
