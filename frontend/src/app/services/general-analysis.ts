import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralAnalysis {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getGeneralAnalysis():Observable<GeneralAnalysis> {
    return this.http.get<GeneralAnalysis>(`${this.apiUrl}/analise_geral`);
  }
}
