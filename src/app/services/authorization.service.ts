import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserInterface } from '../models/user.interface';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  constructor(private http: HttpClient) {}

  login(): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(`${environment.apiUrl}/users`);
  }

  registration(user: UserInterface): Observable<UserInterface> {
    return this.http.post<UserInterface>(`${environment.apiUrl}/users`, user);
  }

  getUserByUsername(username: string): Observable<UserInterface> {
    return this.http.post<UserInterface>(`${environment.apiUrl}/users`, {
      username,
    });
  }
}
