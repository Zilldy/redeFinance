import { Component, OnInit } from '@angular/core';
import { Companies } from '../../services/companies';
import { Company } from '../../models/company.model';
import { GeneralAnalysisService } from '../../services/general-analysis';
import { CommonModule } from '@angular/common';
import { MetricCardComponent } from '../metric-card/metric-card';
import { GeneralAnalysis } from '../../models/general-analysis.model';
import { PieChartComponent } from '../pie-chart/pie-chart';
import { BarChartComponent } from '../bar-chart/bar-chart';
import { CompanyListComponent } from '../company-list/company-list';
import { CompanyDetail } from '../../models/company-detail.model';

@Component({
  selector: 'app-cnpjs-list',
  standalone: true,
  imports: [CommonModule, MetricCardComponent, PieChartComponent, BarChartComponent, CompanyListComponent], 
  templateUrl: './cnpjs-list.html',
  styleUrls: ['./cnpjs-list.scss']
})
export class CnpjsList  implements OnInit{ 
  companies: Company[] = [];
  generalAnalysis: GeneralAnalysis | undefined;
  infoCards:any = [];

  isAnalysisLoaded: boolean = false;
  isCompaniesLoaded: boolean = false;
  substitle = 100;
  
  constructor(
    private companyService: Companies,
    private generalAnalysisService: GeneralAnalysisService
  ) {}

  ngOnInit(){
    this.loadCompanies();
    this.loadGeneralAnalysis();
  }

  loadCompanies(){
    this.companyService.getAllCompanies().subscribe({
      next: (companies)=>{
        this.companies = companies;
        this.isCompaniesLoaded = true; 
      },
      error: (err)=>{
        console.error("Erro ao carregar empresas", err);
        this.isCompaniesLoaded = false;
      },
      complete: ()=>{}
    });
  }

  loadGeneralAnalysis() {
    this.generalAnalysisService.getGeneralAnalysis().subscribe({
      next: (analysis) => {
        this.generalAnalysis = analysis;
        this.isAnalysisLoaded = true;
        const subtitlePaymentType = `${analysis.qtdTipoTransacao.tipo} - ${analysis.qtdTipoTransacao.quantidade}`;
        this.infoCards = [
          { title: "Total Empresas", subtitle: analysis.total_empresas },
          { title: "Empresas em Declínio", subtitle: analysis.empresas_declinio },
          { title: "Maior Tipo de Pagamento X Quantidade", subtitle: subtitlePaymentType },
        ];
      },
      error: (err) => {
        console.error("Erro ao carregar análise geral", err);
        this.isAnalysisLoaded = false;
      },
      complete: () => {},
    });
  }
}
