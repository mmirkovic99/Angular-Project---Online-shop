import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductInterface } from 'src/app/models/product.interface';
import { ProductService } from 'src/app/services/product.service';

enum Type {
  Man,
  Women,
  Kid,
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private productsService: ProductService) {}

  productsObs!: Subscription;
  productList!: ProductInterface[];

  ngOnInit(): void {
    this.getAllProducts();
  }

  selectSize(event: any) {
    const value = event.target.value;
    switch (value) {
      case 'men': {
        this.filterProducts(Type.Man);
        break;
      }
      case 'women': {
        this.filterProducts(Type.Women);
        break;
      }
      case 'kids': {
        this.filterProducts(Type.Kid);
        break;
      }
      default: {
        this.getAllProducts();
      }
    }
  }

  filterProducts(type: Type) {
    this.productsObs = this.productsService
      .getProductsByType(type)
      .subscribe((products: ProductInterface[]) => {
        this.productList = products;
      });
  }

  getAllProducts() {
    this.productsObs = this.productsService
      .getProducts()
      .subscribe((data: ProductInterface[]) => {
        this.productList = data;
      });
  }
}
