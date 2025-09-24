import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { TransactionType } from '../../models/general-analysis.model';

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.data?.forEach((item) => {
      this.typeLIst.push(item.tipo);
      this.totalValueList.push(item.valor_total);
    });
  }

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.typeLIst,
    datasets: [
      {
        data: this.totalValueList,
        backgroundColor: ['#b30000']
      }
    ]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
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
