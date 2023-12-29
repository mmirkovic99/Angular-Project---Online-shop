import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductInterface } from '../models/product.interface';
import { OrderInterface } from '../models/order.interface';
import { UserInterface } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:3000';

  updateUserData(
    id: number,
    name: string,
    surname: string,
    username: string,
    email: string
  ): Observable<UserInterface> {
    return this.http.patch<any>(`${this.apiUrl}/users/${id}`, {
      name,
      surname,
      username,
      email,
    });
  }

  updateUserFavoriteList(
    id: number,
    favorites: Array<ProductInterface>
  ): Observable<UserInterface> {
    return this.http.patch<any>(`${this.apiUrl}/users/${id}`, { favorites });
  }

  orderProducts(
    id: number,
    orders: Array<OrderInterface>
  ): Observable<UserInterface> {
    return this.http.patch<any>(`${this.apiUrl}/users/${id}`, { orders });
  }

  getAllUsers(): Observable<UserInterface[]> {
    return this.http.get<any>(`${this.apiUrl}/users`);
  }
}
