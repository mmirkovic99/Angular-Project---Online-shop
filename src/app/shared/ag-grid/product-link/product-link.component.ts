import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-product-link',
  templateUrl: './product-link.component.html',
  styleUrls: ['./product-link.component.scss'],
})
export class ProductLinkComponent implements ICellRendererAngularComp {
  constructor(private router: Router) {}
  value: any;

  id!: number;

  agInit(params: any): void {
    this.value = params.value;
    this.id = params.data.productInCart.product.id;
  }

  refresh(params: any): boolean {
    return false;
  }

  navigateToProduct() {
    this.router.navigate([`product`, this.id]);
  }
}
