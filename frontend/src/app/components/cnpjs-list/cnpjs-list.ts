import { Component, OnInit } from '@angular/core';
import { Companies } from '../../services/companies';
import { Company } from '../../models/company.model';
import { GeneralAnalysis } from '../../services/general-analysis';

@Component({
  selector: 'app-cnpjs-list',
  imports: [],
  templateUrl: './cnpjs-list.html',
  styleUrl: './cnpjs-list.scss'
})
export class CnpjsList  implements OnInit{ 
  companies: Company[] = [];

  constructor(
    private companyService: Companies,
    private generalAnalysisService: GeneralAnalysis
  ) {}

  ngOnInit(){
    this.loadCompanies();
    this.loadCompanyDetail("cnpj_00001");
    this.loadGeneralAnalysis();
  }

  loadCompanies(){
    this.companyService.getAllCompanies().subscribe((c)=>{});
  }

  loadCompanyDetail(id: string){
    this.companyService.getCompanyById(id).subscribe((c)=>{});
  }

  loadGeneralAnalysis(){
    this.generalAnalysisService.getGeneralAnalysis().subscribe((a)=>{});
  }
}
