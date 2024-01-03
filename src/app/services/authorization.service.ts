import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '../models/user.interface';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/app.constants';
@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  constructor(private http: HttpClient) {}

  login(): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(
      `${API_BASE_URL}${API_ENDPOINTS.USERS}`
    );
  }

  registration(user: UserInterface): Observable<UserInterface> {
    return this.http.post<UserInterface>(
      `${API_BASE_URL}${API_ENDPOINTS.USERS}`,
      user
    );
  }
}
