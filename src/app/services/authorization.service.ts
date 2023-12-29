import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login() {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  registration(data: any) {
    return this.http.post<any[]>(`${this.apiUrl}/users`, data);
  }
}
