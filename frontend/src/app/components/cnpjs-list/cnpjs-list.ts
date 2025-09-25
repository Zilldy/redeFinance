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
  generalAnalysis: GeneralAnalysis | undefined;
  substitle = 100;
  infoCards:any = [];
  isLoading = true;
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
    this.companyService.getAllCompanies().subscribe((c)=>{
      this.companies = c;
    });
  }

  loadCompanyDetail(id: string){
    this.companyService.getCompanyById(id).subscribe((c)=>{});
  }

  loadGeneralAnalysis(){
    this.isLoading = true;
    this.generalAnalysisService.getGeneralAnalysis().subscribe(
      (response) => {
        console.log("General Analysis: ", response);
        if (response && response.classificacoes?.length && response.tipoTransacao?.length) {
          this.generalAnalysis = response;
          const subtitlePaymentType = `${response.qtdTipoTransacao.tipo} - ${response.qtdTipoTransacao.quantidade}`;
          this.infoCards = [
            { title: "Total Empresas", subtitle: response.total_empresas },
            { title: "Empresas em Declínio", subtitle: response.empresas_declinio },
            { title: "Maior Tipo de Pagamento X Quantidade", subtitle: subtitlePaymentType },
          ];
          console.log("INFO CARDS: ", this.infoCards);
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao carregar análise geral:', error);
        this.isLoading = false;
      }
    );
  }
}
