import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ColDef } from 'ag-grid-community';
import { Observable, Subscription, from } from 'rxjs';
import { AppStateInterface } from 'src/app/models/appState.interface';
import {
  OrderInterface,
  OrderProductRow,
} from 'src/app/models/order.interface';
import * as UserAction from '../../store/actions/UserActions';
import * as TableColumn from '../../constants/orders.constants';
import {
  userOrdersSelector,
  userSelector,
} from 'src/app/store/selectors/userStateSelectors';
import { concatMap, map, reduce, scan } from 'rxjs/operators';
import { ProductLinkComponent } from 'src/app/shared/ag-grid/product-link/product-link.component';
import { ProductImageComponent } from 'src/app/shared/ag-grid/product-image/product-image.component';
import { ProductTimeComponent } from 'src/app/shared/ag-grid/product-time/product-time.component';
import { ProductInCartInterface } from 'src/app/models/cartState.interface';
import { ProductTotalPriceComponent } from 'src/app/shared/ag-grid/product-total-price/product-total-price.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  products$!: Observable<OrderProductRow[]>;
  subscriptions: Subscription[] = [];
  gridApi: any;

  constructor(private store: Store<AppStateInterface>) {
    this.colDef = this.createColumns();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  ngOnInit(): void {
    this.products$ = this.createProductsObserveble();
  }

  components = {
    productImage: ProductImageComponent,
    productLink: ProductLinkComponent,
    productTime: ProductTimeComponent,
    productTotalPrice: ProductTotalPriceComponent,
  };

  colDef!: ColDef[];

  getRowHeight(): number {
    return 100;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.updatePinnedRow();
    this.gridApi.sizeColumnsToFit();
  }

  private updatePinnedRow() {
    this.subscriptions.push(
      this.products$.subscribe((data: OrderProductRow[]) => {
        const totalSum = this.calculateTotalPrice(data);
        const pinnedRow = this.makeTotalSumPinnedRow(totalSum);
        this.gridApi.setPinnedBottomRowData([pinnedRow]);
      })
    );
  }

  private calculateTotalPrice(data: OrderProductRow[]): number {
    return data.reduce(
      (sum: number, item: OrderProductRow) =>
        sum + item.productInCart.product.price * item.productInCart.quantity,
      0
    );
  }

  private makeTotalSumPinnedRow(totalPrice: number) {
    return {
      orderID: '',
      productInCart: {
        product: {
          id: '',
          price: '',
        },
        quantity: '',
      },
      time: '',
      totalPrice: totalPrice,
    };
  }

  private createProductsObserveble(): Observable<OrderProductRow[]> {
    return this.store.pipe(
      select(userOrdersSelector),
      concatMap((orders: OrderInterface[]) => {
        return from(orders).pipe(
          map((order: OrderInterface) =>
            order.products.map((productInCart: ProductInCartInterface) => ({
              itemNumber: -1,
              orderID: order.id,
              productInCart: productInCart,
              time: order.time,
              totalPrice: productInCart.product.price * productInCart.quantity,
            }))
          ),
          reduce(
            (acc, productRows) => acc.concat(productRows),
            [] as OrderProductRow[]
          ),
          map((products: OrderProductRow[]) => {
            let counter = 0;
            return products.reverse().map((product: OrderProductRow) => {
              return { ...product, itemNumber: ++counter };
            });
          })
        );
      })
    );
  }

  private createColumns(): ColDef[] {
    return [
      TableColumn.ITEM_NUMBER_COLUMN,
      TableColumn.PRODUCT_IMAGE_COLUMN,
      TableColumn.PRODUCT_NAME_COLUMN,
      TableColumn.TIME_COLUMN,
      TableColumn.PRICE_PER_ITEM_COLUMN,
      TableColumn.QUANTITY_COLUMN,
      TableColumn.TOTAL_PRICE_COLUMN,
    ];
  }

  private unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe()
    );
  }
}
