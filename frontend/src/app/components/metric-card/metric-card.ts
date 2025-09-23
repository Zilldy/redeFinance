import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metric-card.html',
  styleUrls: ['./metric-card.scss']
})
export class MetricCardComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
}
