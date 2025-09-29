import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompaniesService } from '../../services/companies';
import { CompanyDetail } from '../../models/company-detail.model';
import { MetricCardComponent } from '../metric-card/metric-card';
import { LineChartComponent } from '../line-chart/line-chart';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProductsCarouselComponent } from '../products-carousel/products-carousel';

@Component({
  selector: 'app-cnpj-detail',
  standalone: true,
  imports: [CommonModule, MetricCardComponent, LineChartComponent, MatSlideToggleModule, ProductsCarouselComponent ],
  templateUrl: './cnpj-detail.html',
  styleUrls: ['./cnpj-detail.scss']
})
export class CnpjDetailComponent implements OnInit {
  cnpj!: string;
  companyDetail!: CompanyDetail;
  infoCards: any = [];
  selectedView: 'pagadores' | 'recebedores' = 'pagadores';
  isLoading: boolean = true;
  hasError: boolean = false; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompaniesService
  ) {
    this.cnpj = this.route.snapshot.paramMap.get('cnpj') || '';
  }

  ngOnInit() {
    this.companyService.getCompanyById(this.cnpj).subscribe({
      next: async (detail) => {
        if (!detail) {
          this.hasError = true;
          this.isLoading = false;
          return;
        }

        this.companyDetail = detail;

        // Ajusta a view inicial conforme o que tiver dados
        if (this.companyDetail.relacionamentos.pagadores?.length) {
          this.selectedView = 'pagadores';
        } else if (this.companyDetail.relacionamentos.recebedores?.length) {
          this.selectedView = 'recebedores';
        }

        this.infoCards = await this.formatInfoCards(this.companyDetail);
        this.isLoading = false;
      },


      error: (err) => {
        console.error('Erro ao carregar detalhes da empresa:', err);
        this.isLoading = false;
        this.hasError = true;  
      }
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  onToggleChange(event: any) {
    this.selectedView = event.checked ? 'recebedores' : 'pagadores';
  }

  async formatInfoCards(companyDetail: CompanyDetail): Promise<InfoCard[]>{
    const formatBRL = (valor: number | null) =>
      valor !== null
        ? new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(valor)
        : '-';

    return [
      { title: companyDetail.nome, subtitle: companyDetail.cnpj },
      { title: "Saldo da Empresa", subtitle: formatBRL(companyDetail.saldo_total) },
      { title: "Média de Lucro Mensal", subtitle: formatBRL(companyDetail.medLucro) },
      { title: "Classificação de Perfil", subtitle: companyDetail.classificacao },
      { title: "Ramo de Atuação", subtitle: companyDetail.cnae },
    ]
  }
}

export interface InfoCard {
  title: string;
  subtitle: string | number | null;
}
