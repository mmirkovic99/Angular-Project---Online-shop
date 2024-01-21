import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { ProductInterface } from '../models/product.interface';
import { OrderInterface } from '../models/order.interface';
import { UserInterface } from '../models/user.interface';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/app.constants';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  private sendPatchRequestWithParams(
    id: number,
    body: any
  ): Observable<UserInterface> {
    return this.http.patch<UserInterface>(
      `${API_BASE_URL}${API_ENDPOINTS.USERS}${id}`,
      body
    );
  }

  updateUserData(
    id: number,
    name: string,
    surname: string,
    username: string,
    email: string
  ): Observable<UserInterface> {
    return this.sendPatchRequestWithParams(id, {
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
    return this.sendPatchRequestWithParams(id, { favorites });
  }

  orderProducts(
    id: number,
    orders: OrderInterface[]
  ): Observable<UserInterface> {
    return this.sendPatchRequestWithParams(id, { orders });
  }

  getUserByUsername(username: string): Observable<UserInterface> {
    return this.http.post<UserInterface>(
      `${API_BASE_URL}${API_ENDPOINTS.USERS}/users`,
      {
        username,
      }
    );
  }

  getAllUsers(): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(
      `${API_BASE_URL}${API_ENDPOINTS.USERS}/users`
    );
  }

  updateUserPassword(id: number, password: string): Observable<UserInterface> {
    return this.sendPatchRequestWithParams(id, { password });
  }

  checkIfUsernameExists(username: string): Observable<UserInterface> {
    return this.http
      .get<UserInterface[]>(`${API_BASE_URL}${API_ENDPOINTS.USERS}`)
      .pipe(
        mergeMap((userArray: UserInterface[]) => from(userArray)),
        filter((user: UserInterface) => user.username === username)
      );
  }
}
