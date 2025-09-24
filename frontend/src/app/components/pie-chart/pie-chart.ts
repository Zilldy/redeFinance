import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { Classification } from '../../models/general-analysis.model';

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
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.data?.forEach((item) => {
      if(item.porcentagem < 1){
        this.classificationsList.push(`${item.classificacao} - ${item.porcentagem} (imperceptível)`);
      }else{
        this.classificationsList.push(item.classificacao);
      }
      this.percentagesList.push(item.porcentagem);
    });
  }

  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: this.classificationsList,
    datasets: [{
      data: this.percentagesList,
      backgroundColor: ['#b30000', '#3e5b73', '#262626','#afb4bc', '#ccc']
    }]
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
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
