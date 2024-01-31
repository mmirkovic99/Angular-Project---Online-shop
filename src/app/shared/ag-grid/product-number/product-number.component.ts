import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-product-number',
  templateUrl: './product-number.component.html',
  styleUrls: ['./product-number.component.scss'],
})
export class ProductNumberComponent implements ICellRendererAngularComp {
  value!: number;

  agInit(params: any): void {
    this.value = params.node.rowIndex + 1;
  }

  refresh(params: any): boolean {
    return false;
  }
}
