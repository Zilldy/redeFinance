import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="theme-toggle-btn"
      (click)="toggleTheme()"
      [attr.aria-label]="(isDarkTheme$ | async) ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <i class="material-icons">{{ (isDarkTheme$ | async) ? 'light_mode' : 'dark_mode' }}</i>
    </button>
  `,
  styles: [`
    .theme-toggle-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s;
    }

    .theme-toggle-btn:hover {
      background-color: rgba(128, 128, 128, 0.1);
    }

    .theme-toggle-btn i {
      font-size: 24px;
      color: var(--text-color, #000);
    }
  `]
})
export class ThemeToggleComponent {
  readonly isDarkTheme$;

  constructor(private themeService: ThemeService) {
    this.isDarkTheme$ = this.themeService.isDarkTheme$;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}