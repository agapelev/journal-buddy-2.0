import { Injectable, effect, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDark = signal<boolean>(true);

  constructor() {
    // Load theme preference from localStorage or default to dark
    const saved = localStorage.getItem('theme-preference');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = saved ? saved === 'dark' : prefersDark;
    
    this.isDark.set(isDarkMode);
    this.applyTheme();

    // Watch for theme changes and apply them
    effect(() => {
      this.applyTheme();
    });
  }

  toggleTheme() {
    this.isDark.update(val => !val);
    localStorage.setItem('theme-preference', this.isDark() ? 'dark' : 'light');
  }

  private applyTheme() {
    const body = document.body;
    if (this.isDark()) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }
}
