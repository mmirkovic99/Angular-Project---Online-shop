import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-product-link',
  templateUrl: './product-time.component.html',
  styleUrls: ['./product-time.component.scss'],
})
export class ProductTimeComponent implements ICellRendererAngularComp {
  value: any;

  agInit(params: any): void {
    this.value = params.value;
  }

  refresh(params: any): boolean {
    return false;
  }
}
