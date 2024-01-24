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

  constructor(private store: Store<AppStateInterface>) {}
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

  colDef: ColDef[] = [
    { headerName: 'Order ID', field: 'orderID', width: 120 },
    {
      headerName: 'Product Image',
      field: 'productInCart.product.images',
      cellRendererFramework: ProductImageComponent,
      width: 140,
    },
    {
      headerName: 'Product Name',
      field: 'productInCart.product.title',
      cellRendererFramework: ProductLinkComponent,
      cellRendererParams: (params: any) => ({
        data: params.data,
      }),
    },
    {
      headerName: 'Time',
      field: 'time',
      cellRendererFramework: ProductTimeComponent,
    },
    {
      headerName: 'Price Per Item',
      field: 'productInCart.product.price',
      cellRendererFramework: ProductTotalPriceComponent,
    },
    { headerName: 'Quantity', field: 'productInCart.quantity' },
    {
      headerName: 'Total Price',
      field: 'totalPrice',
      cellRendererFramework: ProductTotalPriceComponent,
    },
  ];

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
      concatMap((orders: OrderInterface[]) =>
        from(orders).pipe(
          map((order: OrderInterface) =>
            order.products.map((productInCart: ProductInCartInterface) => ({
              orderID: order.id,
              productInCart: productInCart,
              time: order.time,
              totalPrice: productInCart.product.price * productInCart.quantity,
            }))
          ),
          reduce(
            (acc, productRows) => acc.concat(productRows),
            [] as OrderProductRow[]
          )
        )
      )
    );
  }
  private unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe()
    );
  }
}
