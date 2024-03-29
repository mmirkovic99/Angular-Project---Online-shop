import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, from, of } from 'rxjs';
import { ProductInterface } from '../models/product.interface';
import {
  concatMap,
  filter,
  map,
  mergeMap,
  reduce,
  toArray,
} from 'rxjs/operators';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  private sendGetRequestWithParameter(
    parameterName: string,
    parameter: string | number
  ): Observable<ProductInterface[]> {
    const params = new HttpParams().set(parameterName, parameter);
    return this.http.get<ProductInterface[]>(
      `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}`,
      {
        params,
      }
    );
  }

  getProducts(): Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(
      `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}`
    );
  }

  getProductById(id: number): Observable<ProductInterface[]> {
    return this.sendGetRequestWithParameter('id', id);
  }

  getProductByTitle(title: string): Observable<ProductInterface[]> {
    return this.sendGetRequestWithParameter('title', title);
  }

  getProductsByType(type: number): Observable<ProductInterface[]> {
    return this.sendGetRequestWithParameter('type', type);
  }

  getProductsByCompany(companyName: string): Observable<ProductInterface[]> {
    return this.sendGetRequestWithParameter('companyName', companyName);
  }

  getProductByTag(tag: string): Observable<ProductInterface[]> {
    return this.sendGetRequestWithParameter('tag', tag);
  }

  getFilteredProducts(
    paramName: string,
    values: string[] | number[]
  ): Observable<ProductInterface[]> {
    if (values.length === 1)
      return this.sendGetRequestWithParameter(paramName, values[0].toString());

    return from(values).pipe(
      concatMap((value: string | number) => {
        return this.sendGetRequestWithParameter(paramName, value);
      }),
      reduce(
        (acc: ProductInterface[], products: ProductInterface[]) =>
          acc.concat(products),
        []
      )
    );
  }

  getFilteredProductsMix(
    companies: string[],
    types: number[]
  ): Observable<ProductInterface[]> {
    const productsObservables: Observable<ProductInterface[]>[] = [
      this.getFilteredProducts('companyName', companies),
      this.getFilteredProducts('type', types),
    ];

    return forkJoin(productsObservables).pipe(
      mergeMap((productsArray) => productsArray),
      reduce(
        (acc: ProductInterface[], products: ProductInterface[]) =>
          acc.concat(products),
        []
      ),
      mergeMap((products: ProductInterface[]) => {
        const seenIds = new Set<number>();
        const duplicates = products.filter((product: ProductInterface) => {
          if (seenIds.has(product.id)) return true;
          seenIds.add(product.id);
          return false;
        });

        return of(duplicates);
      })
    );
  }

  searchProducts(searchTerm: string): Observable<ProductInterface[]> {
    return this.getProducts().pipe(
      map((products: ProductInterface[]) =>
        products.filter((product: ProductInterface) =>
          product.title.includes(searchTerm)
        )
      )
    );
  }
}
