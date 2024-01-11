import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppStateInterface } from 'src/app/models/appState.interface';
import { CartStateInterface } from 'src/app/models/cartState.interface';
import { CartService } from 'src/app/services/cart.service';
import { productsLengthSelector } from 'src/app/store/selectors/cartStateSelectors';

@Component({
  selector: 'cart-button',
  templateUrl: './cart-button.component.html',
  styleUrls: ['./cart-button.component.scss'],
})
export class CartButtonComponent implements OnInit, OnDestroy {
  itemsNumber!: number;
  itemsNumberSubscription!: Subscription;

  constructor(
    private store: Store<AppStateInterface>,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.store
      .pipe(select(productsLengthSelector))
      .subscribe((data) => (this.itemsNumber = data));
    // this.itemsNumberSubscription = this.cartService
    //   .getCart()
    //   .subscribe(
    //     (cart: CartStateInterface) => (this.itemsNumber = cart.products.length)
    //   );
  }

  ngOnDestroy(): void {
    this.itemsNumberSubscription.unsubscribe();
  }

  navigateCart() {
    this.router.navigate(['cart']);
  }
}
