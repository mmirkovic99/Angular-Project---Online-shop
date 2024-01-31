import { ProductImageComponent } from '../shared/ag-grid/product-image/product-image.component';
import { ProductLinkComponent } from '../shared/ag-grid/product-link/product-link.component';
import { ProductNumberComponent } from '../shared/ag-grid/product-number/product-number.component';
import { ProductQuantityComponent } from '../shared/ag-grid/product-quantity/product-quantity.component';
import { ProductTimeComponent } from '../shared/ag-grid/product-time/product-time.component';
import { ProductTotalPriceComponent } from '../shared/ag-grid/product-total-price/product-total-price.component';

interface TableColumn {
  headerName: string;
  field?: string;
  cellRendererFramework?: any;
  cellRendererParams?: (params: any) => any;
  width?: number;
  sortable?: boolean;
  filter?: string;
  sort?: string;
  valueGetter?: string;
}

export const ITEM_NUMBER_COLUMN: TableColumn = {
  headerName: '#',
  field: 'itemNumber',
  width: 50,
};

export const PRODUCT_IMAGE_COLUMN: TableColumn = {
  headerName: 'Item Image',
  field: 'productInCart.product.images',
  cellRendererFramework: ProductImageComponent,
  width: 140,
};

export const PRODUCT_NAME_COLUMN: TableColumn = {
  headerName: 'Item Name',
  field: 'productInCart.product.title',
  cellRendererFramework: ProductLinkComponent,
  cellRendererParams: (params: any) => ({
    data: params.data,
  }),
};

export const TIME_COLUMN: TableColumn = {
  headerName: 'Time',
  field: 'time',
  cellRendererFramework: ProductTimeComponent,
};

export const PRICE_PER_ITEM_COLUMN: TableColumn = {
  headerName: 'Price Per Item',
  field: 'productInCart.product.price',
  sortable: true,
  cellRendererFramework: ProductTotalPriceComponent,
};

export const QUANTITY_COLUMN: TableColumn = {
  headerName: 'Quantity',
  field: 'productInCart.quantity',
  sortable: true,
  cellRendererFramework: ProductQuantityComponent,
};

export const TOTAL_PRICE_COLUMN: TableColumn = {
  headerName: 'Total Price',
  field: 'totalPrice',
  cellRendererFramework: ProductTotalPriceComponent,
  sortable: true,
};
