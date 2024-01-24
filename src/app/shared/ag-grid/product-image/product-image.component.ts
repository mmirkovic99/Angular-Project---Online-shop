import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-product-image',
  templateUrl: './product-image.component.html',
  styleUrls: ['./product-image.component.scss'],
})
export class ProductImageComponent implements ICellRendererAngularComp {
  value!: string;

  agInit(params: any): void {
    if (params.value) {
      this.value = (params.value as string[])[0];
    }
  }

  refresh(params: any): boolean {
    return false;
  }
}
