import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnChanges, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Balance } from '../../models/company-detail.model';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, FormsModule],
  templateUrl: './line-chart.html',
  styleUrls: ['./line-chart.scss']
})
export class LineChartComponent  {
  @Input() saldos: Balance[] = [];
  isBrowser: boolean;
  dateList: string[] = [];
  balanceList: number[] = [];
  
  // Propriedades para o filtro de data
  startDate: string = '';
  endDate: string = '';
  originalSaldos: Balance[] = [];
  
  // Propriedade para tema
  isDarkTheme = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    console.log("LINE CHART SALDOS:", this.saldos);
    
    if (!this.isBrowser) return;
    
    this.originalSaldos = [...this.saldos];
    this.initializeDateRange();
    
    // Subscribe to theme changes
    this.themeService.isDarkTheme$.subscribe(isDark => {
      this.isDarkTheme = isDark;
      this.updateChart();
    });
  }

  private initializeDateRange() {
    if (this.saldos && this.saldos.length > 0) {
      // Definir data inicial como a primeira data disponível
      this.startDate = this.saldos[0].data;
      // Definir data final como a última data disponível
      this.endDate = this.saldos[this.saldos.length - 1].data;
    }
  }

  onDateRangeChange() {
    this.filterDataByDateRange();
    this.updateChart();
  }

  private filterDataByDateRange() {
    if (!this.startDate || !this.endDate) {
      this.saldos = [...this.originalSaldos];
      return;
    }

    this.saldos = this.originalSaldos.filter(item => {
      const itemDate = new Date(item.data);
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      
      return itemDate >= start && itemDate <= end;
    });
  }

  private updateChart() {
    this.dateList = [];
    this.balanceList = [];

    this.saldos?.forEach((item) => {
      this.dateList.push(item.data);
      this.balanceList.push(item.saldo);
    });

    // Cores dinâmicas baseadas no tema
    const lineColor = this.isDarkTheme ? '#b30000' : '#d32f2f';
    const fillColor = this.isDarkTheme ? 'rgba(255, 27, 27, 0.1)' : 'rgba(211, 47, 47, 0.1)';

    this.lineChartData = {
      labels: this.dateList,
      datasets: [
        {
          data: this.balanceList,
          label: 'Saldo da Empresa',
          backgroundColor: fillColor,
          borderColor: lineColor,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: lineColor,
          pointBorderColor: this.isDarkTheme ? '#fff' : '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        }
      ]
    };
  }

  // Dados do gráfico
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Saldo da Empresa',
        backgroundColor: ['#b30000'],
      }
    ]
  };

  // Opções do gráfico
  get lineChartOptions(): ChartOptions<'line'> {
    return {
      responsive: true,
      plugins: {
        tooltip: {
          backgroundColor: this.isDarkTheme ? '#2a2a2a' : '#fff',
          titleColor: this.isDarkTheme ? '#fff' : '#333',
          bodyColor: this.isDarkTheme ? '#fff' : '#333',
          borderColor: this.isDarkTheme ? '#555' : '#ddd',
          borderWidth: 1,
          callbacks: {
            label: (context) => {
              const value = context.raw as number;
              return 'R$ ' + value.toLocaleString('pt-BR');
            }
          }
        },
        legend: { 
          display: true,
          labels: {
            color: this.isDarkTheme ? '#fff' : '#333'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: this.isDarkTheme ? '#ccc' : '#666'
          },
          grid: {
            color: this.isDarkTheme ? '#444' : '#e0e0e0'
          }
        },
        y: {
          ticks: {
            color: this.isDarkTheme ? '#ccc' : '#666',
            callback: (value) => {
              if (typeof value === 'number') {
                return 'R$ ' + value.toLocaleString('pt-BR');
              }
              return value;
            }
          },
          grid: {
            color: this.isDarkTheme ? '#444' : '#e0e0e0'
          }
        }
      }
    };
  }
}
