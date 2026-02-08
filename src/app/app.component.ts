// Copyright 2026 - Дневник разработки Льва и Gemini 3
// Адаптировано из оригинального Google LLC образца

import { Component, signal, OnInit, inject, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JournalComponent } from './journal.component'
import { JournalEntries } from './journal-entries';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JournalComponent, FormsModule, CommonModule],
  template: `
  <div class="min-h-screen dark:bg-slate-950 dark:text-slate-100 transition-colors">
    <!-- Theme toggle button -->
    <div class="fixed top-4 right-4 z-50">
      <button 
        (click)="themeService.toggleTheme()"
        class="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
        [attr.title]="themeService.isDark() ? 'Светлая тема' : 'Тёмная тема'"
      >
        {{ themeService.isDark() ? '☀️' : '🌙' }}
      </button>
    </div>

    @if(this.api_key != "" && this.selected_journal() != "") {
      <app-journal [api_key]="api_key" [selected_journal]="selected_journal()" [goBack]="goBack()" />
    } @else {
      <div class="heading">
      <h1>
        <span class="h1-word h1-w1">Journal</span>
        «<span class="h1-word h1-w2">Web</span>
        <span class="h1-word h1-w3">Arystan</span>»</h1>
      <p class="subtitle-text">
        <span class="p-word p-w1">Web</span>
        <span class="p-word p-w2">Development</span>
        <span class="p-word p-w3">Studio</span>
        «<span class="p-word p-w4">Web</span>
        <span class="p-word p-w5">Arystan</span>»</p>
      </div>

      <div class="gemini_api_key">
      <label for="api_key">Gemini API key</label>
      <p>Введите ваш API ключ для доступа к модели Gemini 3 Flash</p>
      <p class="api_key_help">Ключ можно получить в <a href="https://ai.google.dev/gemini-api/docs/api-key" target="_blank">Google AI Studio</a></p>
      <input type="text" name="api_key" [(ngModel)]="api_key" (ngModelChange)="onApiKeyChange($event)" placeholder="Вставьте ваш API KEY здесь..." />
      @if(api_key) {
        <button class="clear_key_btn" (click)="clearApiKey()">🔄 Очистить ключ</button>
      }
      </div>

      <p class="helper_text">Выберите категорию записей для анализа нейросетью:</p>

      <div class="journals">
      <div (click)="select_dev_log()">
      <h2>🛠 Dev Log: Web & AI</h2>
      <p>Технические решения, исправление багов и прогресс в изучении Angular и нейросетей.</p>
      </div>

      <div (click)="select_ai_insights()">
      <h2>🧠 AI & Philosophy</h2>
      <p>Размышления о духовном трезвении, будущем технологий и "Школе Христа".</p>
      </div>
      </div>
    }
  </div>
  `,
  styles: [`
    * { max-width: 800px; }
    :host { display: block; }
  `],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  api_key = ""
  selected_journal = signal("")
  private readonly API_KEY_STORAGE_KEY = 'gemini_api_key_session';
  private journalEntries = inject(JournalEntries);
  themeService = inject(ThemeService);

  ngOnInit() {
    // 📚 Загружаем API ключ из SessionStorage при старте приложения
    const savedKey = sessionStorage.getItem(this.API_KEY_STORAGE_KEY);
    if (savedKey) {
      this.api_key = savedKey;
      // Инициализируем журнал-entries с сохранённым ключом
      this.journalEntries.initializeWithApiKey(savedKey);
    }
  }

  // 💾 Сохраняем ключ в SessionStorage при изменении
  onApiKeyChange(value: string) {
    this.api_key = value;
    if (value.trim() !== "") {
      sessionStorage.setItem(this.API_KEY_STORAGE_KEY, value);
      // Инициализируем при вводе нового ключа
      this.journalEntries.initializeWithApiKey(value);
    }
  }

  // 🔄 Очищаем старый ключ и SessionStorage
  clearApiKey() {
    this.api_key = "";
    sessionStorage.removeItem(this.API_KEY_STORAGE_KEY);
    console.log("✅ Ключ удален. Введите новый ключ.");
  }

  // Возврат к списку журналов и очистка данных при необходимости
  goBack() {
    return () => {
      this.selected_journal.set("")
    }
  }

  // Выбор журнала разработки
  select_dev_log() {
    if(this.api_key.trim() !== "") {
      this.selected_journal.set("dev_log")
    } else {
      alert("Сначала введите API ключ!");
    }
  }

  // Выбор журнала инсайтов
  select_ai_insights() {
    if(this.api_key.trim() !== "") {
      this.selected_journal.set("ai_insights")
    } else {
      alert("Сначала введите API ключ!");
    }
  }
}
