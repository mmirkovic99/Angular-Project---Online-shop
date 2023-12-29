import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';
import * as UserAction from '../../store/actions/UserActions';
import * as CartAction from '../../store/actions/CartActions';
import { AppStateInterface } from 'src/app/models/appState.interface';
import { Observable, Subscription } from 'rxjs';
import { userFavoritesSelector } from 'src/app/store/selectors/userStateSelectors';
import { ProductInterface } from 'src/app/models/product.interface';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  product!: ProductInterface;
  selectedImage: string = '';
  allProducts: any;
  cart$!: Observable<any[]>;
  size: number | undefined;
  favorites!: Array<ProductInterface>;
  showError = false;

  private subscriptions: Subscription[];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private store: Store<AppStateInterface>
  ) {
    this.subscriptions = [];
  }

  ngOnInit(): void {
    this.subscriptions.push(this.getProductIdFromURL(), this.setUserId());
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  selectImage(index: number): void {
    this.selectedImage = this.product.images[index];
  }

  navigateProduct(id: number): void {
    this.router.navigate([`product/${id}`]);
  }

  addToCart(): void {
    if (!this.size) {
      this.showError = true;
      return;
    }
    this.showError = false;
    let productToAdd = Object.assign({}, this.product);
    productToAdd = { ...productToAdd, sizes: [this.size] };
    this.store.dispatch(CartAction.addToCart({ product: productToAdd }));
  }

  selectSize(event: any) {
    this.size = event.target.value;
  }

  addToFavorites(): void {
    this.store.dispatch(
      UserAction.updateUserFavoriteList({
        id: 1,
        favorites: [...this.favorites, this.product],
      })
    );
  }

  private getProductIdFromURL(): Subscription {
    return this.route.params
      .pipe(
        switchMap((params) => {
          return this.productService.getProductById(params['id']);
        })
      )
      .subscribe((productArray) => {
        [this.product] = productArray;
        this.selectedImage = this.product.images[0];
        this.subscriptions.push(this.loadAllProducts());
      });
  }

  private setUserId(): Subscription {
    return this.store
      .pipe(select(userFavoritesSelector))
      .subscribe((favorites) => console.log((this.favorites = favorites)));
  }

  private loadAllProducts(): Subscription {
    return this.productService
      .getProductByTitle(this.product.title)
      .subscribe((data) => (this.allProducts = data));
  }

  private unsubscribe(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
