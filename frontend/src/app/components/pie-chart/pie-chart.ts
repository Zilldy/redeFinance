import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { Classification } from '../../models/general-analysis.model';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './pie-chart.html',
  styleUrls: ['./pie-chart.scss']
})
export class PieChartComponent {
  @Input() data: Classification[] | undefined;
  isBrowser = false;
  classificationsList: string[] = [];
  percentagesList: number[] = [];
  isDarkTheme = false;
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;
    
    console.log(this.data);

    this.data?.forEach((item) => {
      if(item.porcentagem < 1){
        this.classificationsList.push(`${item.classificacao} - ${item.porcentagem} (imperceptível)`);
      }else{
        this.classificationsList.push(item.classificacao);
      }
      this.percentagesList.push(item.porcentagem);
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
    this.pieChartData = {
      labels: this.classificationsList,
      datasets: [{
        data: this.percentagesList,
        backgroundColor: colors,
        borderColor: this.isDarkTheme ? '#2a2a2a' : '#fff',
        borderWidth: 2
      }]
    };
  }

  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#b30000', '#3e5b73', '#414141ff','#92979eff', '#ccc']
    }]
  };

  get pieChartOptions(): ChartConfiguration<'pie'>['options'] {
    return {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: this.isDarkTheme ? '#e0e0e0' : '#333',
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: this.isDarkTheme ? '#2a2a2a' : '#fff',
          titleColor: this.isDarkTheme ? '#fff' : '#333',
          bodyColor: this.isDarkTheme ? '#fff' : '#333',
          borderColor: this.isDarkTheme ? '#555' : '#ddd',
          borderWidth: 1,
          callbacks: {
            label: (context) => {
              const value = context.parsed;
              return `${value}%`;
            }
          }
        }
      }
    };
  }
}
