import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnChanges, PLATFORM_ID } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Balance } from '../../models/company-detail.model';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './line-chart.html',
  styleUrls: ['./line-chart.scss']
})
export class LineChartComponent  {
  @Input() saldos: Balance[] = [];
  isBrowser: boolean;
  dateList: string[] = [];
  balanceList: number[] = []

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    console.log("LINE CHART SALDOS:", this.saldos);
    
    if (!this.isBrowser) return;
    this.saldos?.forEach((item) => {
      this.dateList.push(item.data);
      this.balanceList.push(item.saldo);
    });

    this.lineChartData = {
      labels: this.dateList,
      datasets: [
        {
          data: this.balanceList,
          label: 'Saldo da Empresa',
          backgroundColor: ['#b30000'],
          borderColor: '#d32f2f', 
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
  lineChartOptions: ChartOptions<'line'>= {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return 'R$ ' + value.toLocaleString('pt-BR');
          }
        }
      },
      legend: { display: true }
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => {
            if (typeof value === 'number') {
              return 'R$ ' + value.toLocaleString('pt-BR');
            }
            return value;
          }
        }
      }
    }
  };
}
