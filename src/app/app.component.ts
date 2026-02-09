// Copyright 2026 - Дневник разработки Льва и Gemini 3
// Адаптировано из оригинального Google LLC образца

import { Component, signal, OnInit, inject, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JournalComponent } from './journal.component'
import { JournalEntries } from './journal-entries';
import { ThemeService } from './theme.service';

import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JournalComponent, FormsModule, CommonModule, HeaderComponent],
  template: `
  <div class="app-container">
    <app-header></app-header>
    <!-- Main Content -->
    <main class="main-content">
      @if(this.api_key && this.selected_journal()) {
        <app-journal [api_key]="api_key" [selected_journal]="selected_journal()" [goBack]="goBack()" />
      } @else {
        <!-- Welcome Section -->
        <header class="welcome-section">
          <h1 class="main-title">
            <span class="title-word title-1">Journal</span>
            <span class="title-word title-2">Web</span>
            <span class="title-word title-3">Arystan</span>
          </h1>
          <p class="subtitle">
            <span class="subtitle-word subtitle-1">Web</span>
            <span class="subtitle-word subtitle-2">Development</span>
            <span class="subtitle-word subtitle-3">Studio</span>
          </p>
        </header>

        <!-- API Key Section -->
        <section class="api-section">
          <h2 class="section-title">Gemini API Key</h2>
          <p class="section-desc">Введите ваш API ключ для доступа к модели Gemini 3 Flash</p>
          <p class="api-help">
            Ключ можно получить в 
            <a href="https://ai.google.dev/gemini-api/docs/api-key" target="_blank" rel="noopener">Google AI Studio</a>
          </p>
          <div class="input-group">
            <input 
              type="text" 
              [(ngModel)]="api_key" 
              (ngModelChange)="onApiKeyChange($event)" 
              placeholder="Введите ваш API ключ..."
              class="api-input"
            />
            @if(api_key) {
              <button (click)="clearApiKey()" class="clear-btn">Очистить</button>
            }
          </div>
        </section>

        <!-- Journal Selection -->
        <section class="journal-selection">
          <h2 class="selection-title">Выберите журнал</h2>
          
          <div class="journal-cards">
            <div class="journal-card dev-card" (click)="select_dev_log()">
              <div class="card-icon">🛠</div>
              <h3 class="card-title">Dev Log: Web & AI</h3>
              <p class="card-desc">Технические решения, исправление багов и прогресс в изучении Angular и нейросетей</p>
            </div>

            <div class="journal-card ai-card" (click)="select_ai_insights()">
              <div class="card-icon">🧠</div>
              <h3 class="card-title">AI & Philosophy</h3>
              <p class="card-desc">Размышления о духовном трезвении, будущем технологий и "Школе Христа"</p>
            </div>
          </div>
        </section>
      }
    </main>
  </div>
  `,
  styles: [],
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
