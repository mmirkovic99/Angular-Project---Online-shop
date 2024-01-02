import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CompanyInterface } from '../models/company.interface';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private url = `${environment.apiUrl}/companies`;

  constructor(private http: HttpClient) {}

  public getCompanies(): Observable<CompanyInterface[]> {
    return this.http.get<CompanyInterface[]>(this.url);
  }
}
