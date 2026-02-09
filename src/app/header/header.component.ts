import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="main-header">
      <div class="header-content">
        <div class="header-left">
          <!-- Logo will go here -->
          <img src="assets/logo-ms-sock.png" alt="Web Arystan Logo" class="logo" />
        </div>
        <nav class="header-nav">
          <ul>
            <li *ngFor="let link of navLinks">
              <a [href]="link.url" target="_blank" rel="noopener">{{ link.label }}</a>
            </li>
          </ul>
        </nav>
        <div class="header-right">
          <!-- Theme toggle button -->
          <button
            (click)="themeService.toggleTheme()"
            class="theme-toggle-button"
            [attr.title]="themeService.isDark() ? 'Светлая тема' : 'Тёмная тема'"
          >
            {{ themeService.isDark() ? '☀️' : '🌙' }}
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  themeService = inject(ThemeService);

  navLinks = [
    { label: 'Shekinah Mission', url: 'https://shekinah-cloud.vercel.app/' },
    { label: 'School of Christ', url: 'https://mission-shekinah.vercel.app/' },
    { label: 'Shekinah Blog', url: 'https://shekinah-blog.vercel.app/' },
    { label: 'AI', url: 'https://ai.dessyatykh.workers.dev/' },
  ];
}
