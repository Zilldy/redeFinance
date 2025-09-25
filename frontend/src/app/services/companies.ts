import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Company } from '../models/company.model';
import { CompanyDetail } from '../models/company-detail.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Companies {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}/empresas`);
  }

  getCompanyById(id: string):Observable<CompanyDetail> {
    return this.http.get<CompanyDetail>(`${this.apiUrl}/empresas/${id}`);
  }
} 
