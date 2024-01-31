import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-product-total-price',
  templateUrl: './product-total-price.component.html',
  styleUrls: ['./product-total-price.component.scss'],
})
export class ProductTotalPriceComponent implements ICellRendererAngularComp {
  value!: number;

  agInit(params: any): void {
    this.value = params.value;
  }

  refresh(params: any): boolean {
    return false;
  }
}
