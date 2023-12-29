import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppStateInterface } from 'src/app/models/appState.interface';
import { productsLengthSelector } from 'src/app/store/selectors/cartStateSelectors';

@Component({
  selector: 'cart-button',
  templateUrl: './cart-button.component.html',
  styleUrls: ['./cart-button.component.scss'],
})
export class CartButtonComponent implements OnInit {
  itemsNumber!: number;

  constructor(private store: Store<AppStateInterface>, private router: Router) {
    this.store
      .pipe(select(productsLengthSelector))
      .subscribe((data) => (this.itemsNumber = data));
  }

  ngOnInit(): void {}

  navigateCart() {
    this.router.navigate(['cart']);
  }
}
