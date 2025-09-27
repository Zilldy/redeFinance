import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = new BehaviorSubject<boolean>(false);
  isDarkTheme$ = this.isDarkTheme.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Check if user has a saved theme preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.setTheme(savedTheme === 'dark');
      } else {
        // Check if user prefers dark mode at system level
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setTheme(prefersDark);
      }
    }
  }

  toggleTheme() {
    this.setTheme(!this.isDarkTheme.value);
  }

  setTheme(isDark: boolean) {
    this.isDarkTheme.next(isDark);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      document.body.classList.toggle('dark-theme', isDark);
    }
  }
}