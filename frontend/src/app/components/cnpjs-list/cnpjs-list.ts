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

@Component({
  selector: 'app-cnpjs-list',
  standalone: true,
  imports: [CommonModule, MetricCardComponent, PieChartComponent, BarChartComponent, CompanyListComponent], 
  templateUrl: './cnpjs-list.html',
  styleUrls: ['./cnpjs-list.scss']
})
export class CnpjsList  implements OnInit{ 
  companies: Company[] = [];
  substitle = 100;
  infoCards:any = [];
  generalAnalysis: GeneralAnalysis | undefined;
  constructor(
    private companyService: Companies,
    private generalAnalysisService: GeneralAnalysisService
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
    this.generalAnalysisService.getGeneralAnalysis().subscribe((a)=>{
      console.log("General Analysis: ", a);
      this.generalAnalysis = a;
      const subtitlePaymentType = `${a.qtdTipoTransacao.tipo} - ${a.qtdTipoTransacao.quantidade}`;
        this.infoCards = [
          { title: "Total Empresas", subtitle: a.total_empresas },
          { title: "Empresas em Declínio", subtitle: a.empresas_declinio },
          { title: "Maior Tipo de Pagamento X Quantidade", subtitle: subtitlePaymentType },
        ];
        console.log("INFO CARDS: ", this.infoCards);
    });
  }
}
