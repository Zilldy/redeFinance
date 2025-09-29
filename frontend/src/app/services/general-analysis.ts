import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralAnalysis } from '../models/general-analysis.model';

@Injectable({
  providedIn: 'root'
})
export class GeneralAnalysisService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getGeneralAnalysis():Observable<GeneralAnalysis> {
    return this.http.get<GeneralAnalysis>(`${this.apiUrl}/analise_geral`);
  }
}
