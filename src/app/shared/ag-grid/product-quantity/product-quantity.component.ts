import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.scss'],
})
export class ProductQuantityComponent implements ICellRendererAngularComp {
  value!: number;

  agInit(params: any): void {
    this.value = params.value;
  }

  refresh(params: any): boolean {
    return false;
  }
}
