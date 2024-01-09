import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyInterface } from '../models/company.interface';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  public getCompanies(): Observable<CompanyInterface[]> {
    return this.http.get<CompanyInterface[]>(
      `${API_BASE_URL}${API_ENDPOINTS.COMPANIES}`
    );
  }
}
