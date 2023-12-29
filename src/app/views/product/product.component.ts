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
import { UserService } from 'src/app/services/user.service';

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

  private routeSubscription!: Subscription;
  private productServiceSubscription!: Subscription;
  private userIdSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private store: Store<AppStateInterface>
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params
      .pipe(
        switchMap((params) => {
          return this.productService.getProductById(params['id']);
        })
      )
      .subscribe((productArray) => {
        [this.product] = productArray;
        this.selectedImage = this.product.images[0];
        this.productServiceSubscription = this.loadAllProducts();
      });
    this.setUserId();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  selectImage(index: number) {
    this.selectedImage = this.product.images[index];
  }

  navigateProduct(id: number) {
    this.router.navigate([`product/${id}`]);
  }

  addToCart() {
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

  addToFavorites() {
    this.store.dispatch(
      UserAction.updateUserFavoriteList({
        id: 1,
        favorites: [...this.favorites, this.product],
      })
    );
  }

  private setUserId() {
    this.userIdSubscription = this.store
      .pipe(select(userFavoritesSelector))
      .subscribe((favorites) => console.log((this.favorites = favorites)));
  }

  private loadAllProducts(): Subscription {
    return this.productService
      .getProductByTitle(this.product.title)
      .subscribe((data) => (this.allProducts = data));
  }

  private unsubscribe() {
    this.routeSubscription.unsubscribe();
    this.userIdSubscription.unsubscribe();
    this.productServiceSubscription.unsubscribe();
  }
}
