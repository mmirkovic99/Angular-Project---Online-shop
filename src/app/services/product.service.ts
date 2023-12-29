import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  searchProducts(productName: string): Observable<any> {
    const params = new HttpParams().set('title', productName);
    return this.http.get<any[]>(`${this.apiUrl}/products`, { params });
  }

  getProductById(id: number): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.get<any>(`${this.apiUrl}/products`, { params });
  }

  getProductByTitle(title: string): Observable<any> {
    const params = new HttpParams().set('title', title);
    return this.http.get<any>(`${this.apiUrl}/products`, { params });
  }

  getProductsByType(type: number): Observable<any> {
    const params = new HttpParams().set('type', type);
    return this.http.get<any>(`${this.apiUrl}/products`, { params });
  }
}
