import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent {
  menuOpen = false;

  constructor(private router: Router) {}
  
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  backToHome() {
    this.router.navigate(['/']);
  }
}
