import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';
import * as UserAction from '../../store/actions/UserActions';
import * as CartAction from '../../store/actions/CartActions';
import { AppStateInterface } from 'src/app/models/appState.interface';
import { Observable, Subscription } from 'rxjs';
import {
  userFavoritesSelector,
  userIdSelector,
} from 'src/app/store/selectors/userStateSelectors';
import { ProductInterface } from 'src/app/models/product.interface';
import { CartStateInterface } from 'src/app/models/cartState.interface';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  product!: ProductInterface;
  selectedImage: string = '';
  allProducts!: Array<ProductInterface>;
  size: number | undefined;
  userId!: number;
  favorites!: Array<ProductInterface>;
  showError = false;

  private subscriptions: Subscription[];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private store: Store<AppStateInterface>,
    private cartService: CartService
  ) {
    this.subscriptions = [];
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.getProductIdFromURL(),
      this.setFavorites(),
      this.setUserId()
    );
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

    // this.cartService.addToCart(productToAdd);
  }

  selectSize(event: any) {
    this.size = event.target.value;
  }

  changeFavoritesList(): void {
    if (this.userId === 0) this.router.navigate(['/auth/login']);
    const addItem = (
      userId: number,
      favorites: ProductInterface[],
      product: ProductInterface
    ) => {
      this.store.dispatch(
        UserAction.updateUserFavoriteList({
          id: userId,
          favorites: [...favorites, product],
        })
      );
    };

    const removeItem = (
      userId: number,
      favorites: ProductInterface[],
      productId: number
    ) => {
      this.store.dispatch(
        UserAction.updateUserFavoriteList({
          id: userId,
          favorites: favorites.filter(
            (product: ProductInterface) => product.id !== productId
          ),
        })
      );
    };

    const isInFavoritesList = this.checkFavoritesList(
      this.product.id,
      this.favorites
    );
    if (!isInFavoritesList) addItem(this.userId, this.favorites, this.product);
    else removeItem(this.userId, this.favorites, this.product.id);
  }

  private checkFavoritesList(id: number, products: ProductInterface[]) {
    const isInFavoritesList = products.some(
      (product: ProductInterface) => product.id === id
    );
    return isInFavoritesList;
  }

  private getProductIdFromURL(): Subscription {
    return this.route.params
      .pipe(
        switchMap((params) => {
          return this.productService.getProductById(params['id']);
        })
      )
      .subscribe((product: ProductInterface[]) => {
        [this.product] = product;
        this.selectedImage = this.product.images[0];
        this.subscriptions.push(this.loadSimilarProducts());
      });
  }

  private setFavorites(): Subscription {
    return this.store
      .pipe(select(userFavoritesSelector))
      .subscribe((favorites) => (this.favorites = favorites));
  }

  private setUserId(): Subscription {
    return this.store
      .pipe(select(userIdSelector))
      .subscribe((id) => (this.userId = id));
  }

  private loadSimilarProducts(): Subscription {
    return this.productService
      .getProductByTitle(this.product.title)
      .subscribe(
        (products: Array<ProductInterface>) => (this.allProducts = products)
      );
  }

  private unsubscribe(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
