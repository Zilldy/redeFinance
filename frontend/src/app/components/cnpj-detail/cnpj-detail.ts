import { Component, OnInit } from '@angular/core';
import { GeneralAnalysisService } from '../../services/general-analysis';

@Component({
  selector: 'app-cnpj-detail',
  imports: [],
  templateUrl: './cnpj-detail.html',
  styleUrl: './cnpj-detail.scss'
})
export class CnpjDetail implements OnInit{
  constructor(private generalAnalysisService: GeneralAnalysisService) {}
  ngOnInit(){}
}
