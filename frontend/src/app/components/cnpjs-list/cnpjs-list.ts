import { Component } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { finalize, map, catchError } from 'rxjs/operators';
import { CompaniesService } from '../../services/companies';
import { GeneralAnalysisService } from '../../services/general-analysis';
import { Company } from '../../models/company.model';
import { GeneralAnalysis } from '../../models/general-analysis.model';
import { CommonModule } from '@angular/common';
import { MetricCardComponent } from '../metric-card/metric-card';
import { PieChartComponent } from '../pie-chart/pie-chart';
import { BarChartComponent } from '../bar-chart/bar-chart';
import { CompanyListComponent } from '../company-list/company-list';
import { RouterModule } from '@angular/router';
import { LineChartComponent } from '../line-chart/line-chart';

@Component({
  selector: 'app-cnpjs-list',
  standalone: true,
  imports: [
    CommonModule,
    MetricCardComponent,
    PieChartComponent,
    BarChartComponent,
    CompanyListComponent,
    RouterModule,
    LineChartComponent
  ],
  templateUrl: './cnpjs-list.html',
  styleUrls: ['./cnpjs-list.scss']
})
export class CnpjsList {
  companies$!: Observable<Company[]>;
  generalAnalysis$!: Observable<GeneralAnalysis>;
  infoCards$!: Observable<any[]>;

  isLoading = true;
  hasError = false;

  constructor(
    private companyService: CompaniesService,
    private generalAnalysisService: GeneralAnalysisService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.hasError = false;

    this.companies$ = this.companyService.getAllCompanies().pipe(
      catchError((err) => {
        console.error('Erro ao carregar empresas', err);
        this.hasError = true;
        this.isLoading = false;
        throw err;
      })
    );

    this.generalAnalysis$ = this.generalAnalysisService.getGeneralAnalysis().pipe(
      catchError((err) => {
        console.error('Erro ao carregar análise', err);
        this.hasError = true;
        this.isLoading = false;
        throw err;
      })
    );

    this.infoCards$ = this.generalAnalysis$.pipe(
      map((analysis) => {
        const formatter = new Intl.NumberFormat('pt-BR');
        const subtitlePaymentType = `${analysis.qtdTipoTransacao.tipo} - ${formatter.format(analysis.qtdTipoTransacao.quantidade)}`;
        return [
          { title: "Total Empresas", subtitle: formatter.format(analysis.total_empresas) },
          { title: "Empresas em Declínio", subtitle: formatter.format(analysis.empresas_declinio) },
          { title: "Maior Tipo de Pagamento X Quantidade", subtitle: subtitlePaymentType },
        ];
      })
    );

    forkJoin([this.companies$, this.generalAnalysis$])
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        error: () => (this.hasError = true),
      });
  }

  reloadPage() {
    this.loadData();
  }
}
