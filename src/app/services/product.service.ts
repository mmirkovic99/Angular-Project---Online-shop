import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductInterface } from '../models/product.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(`${environment.apiUrl}/products`);
  }

  searchProducts(productName: string): Observable<ProductInterface[]> {
    const params = new HttpParams().set('title', productName);
    return this.http.get<ProductInterface[]>(`${environment.apiUrl}/products`, {
      params,
    });
  }

  getProductById(id: number): Observable<ProductInterface[]> {
    // Why does this always return an array even when I use ProductInterface instead of ProductInterface[]...
    const params = new HttpParams().set('id', id);
    return this.http.get<ProductInterface[]>(`${environment.apiUrl}/products`, {
      params,
    });
  }

  getProductByTitle(title: string): Observable<ProductInterface[]> {
    const params = new HttpParams().set('title', title);
    return this.http.get<ProductInterface[]>(`${environment.apiUrl}/products`, {
      params,
    });
  }

  getProductsByType(type: number): Observable<ProductInterface[]> {
    const params = new HttpParams().set('type', type);
    return this.http.get<ProductInterface[]>(`${environment.apiUrl}/products`, {
      params,
    });
  }
}
