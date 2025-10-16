import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { TransactionType } from '../../models/general-analysis.model';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './bar-chart.html',
  styleUrls: ['./bar-chart.scss']
})
export class BarChartComponent {
  @Input() data: TransactionType[] | undefined;
  isBrowser = false;
  typeLIst: string[] = [];
  totalValueList: number[] = [];
  isDarkTheme = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;
    
    this.data?.forEach((item) => {
      this.typeLIst.push(item.tipo);
      this.totalValueList.push(item.valor_total);
    });

    // Subscribe to theme changes
    this.themeService.isDarkTheme$.subscribe(isDark => {
      this.isDarkTheme = isDark;
      this.updateChart();
    });
  }

  private updateChart() {
    // Cores dinâmicas baseadas no tema
    const colors = ['#b30000', '#3e5b73', '#414141ff', '#92979eff', '#ccc']; // Cores originais para tema claro

    // Atualiza os dados do gráfico
    this.barChartData = {
      labels: this.typeLIst,
      datasets: [
        {
          data: this.totalValueList,
          backgroundColor: colors.slice(0, this.totalValueList.length),
          borderColor: this.isDarkTheme ? '#2a2a2a' : '#fff',
          borderWidth: 1
        }
      ]
    };
  }

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#b30000']
      }
    ]
  };

  get barChartOptions(): ChartConfiguration<'bar'>['options'] {
    return {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: this.isDarkTheme ? '#2a2a2a' : '#fff',
          titleColor: this.isDarkTheme ? '#fff' : '#333',
          bodyColor: this.isDarkTheme ? '#fff' : '#333',
          borderColor: this.isDarkTheme ? '#555' : '#ddd',
          borderWidth: 1,
          callbacks: {
            label: (context) => {
              const value = context.parsed.y;
              return 'R$ ' + value.toLocaleString('pt-BR');
            }
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
            callback: function(value) {
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
