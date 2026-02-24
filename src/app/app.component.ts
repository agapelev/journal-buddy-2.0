// Copyright 2026 - Дневник разработки Льва и Gemini 3
// Адаптировано из оригинального Google LLC образца

import { Component, signal, OnInit, inject, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JournalComponent } from './journal.component'
import { JournalEntries } from './journal-entries';
import { ThemeService } from './theme.service';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JournalComponent, FormsModule, CommonModule, HeaderComponent, FooterComponent],
  template: `
  <div class="app-container">
  <app-header></app-header>

  <main class="main-content">
  @if(api_key && selected_journal()) {
    <app-journal
    [api_key]="api_key"
    [selected_journal]="selected_journal()"
    [goBack]="goBack"
    />
  } @else {
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

    <section class="api-section">
    <h2 class="section-title">Gemini API Key</h2>
    <p class="section-desc">Введите ваш API ключ для доступа к модели Gemini 3 Flash</p>
    <p class="api-help">
    Ключ можно получить в
    <a href="https://ai.google.dev/gemini-api/docs/api-key" target="_blank" rel="noopener">Google AI Studio</a>
    </p>
    <div class="input-group">
    <input
    type="password"
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

    <section class="journal-selection">
    <h2 class="selection-title">Выберите журнал</h2>

    <div class="journal-cards">
    <div class="journal-card dev-card" (click)="select_dev_log()">
    <div class="card-icon">🛠</div>
    <h3 class="card-title">Dev Log: Web & AI</h3>
    <p class="card-desc">Технические решения, исправление багов и прогресс в изучении Angular</p>
    </div>

    <div class="journal-card shekinah-card" (click)="select_shekinah()">
    <div class="card-icon">⛪</div>
    <h3 class="card-title">Mission Shekinah</h3>
    <p class="card-desc">Миссия Шехина и Хроники Школы Христа</p>
    </div>

    <div class="journal-card ai-card" (click)="select_ai_insights()">
    <div class="card-icon">🧠</div>
    <h3 class="card-title">AI & Philosophy</h3>
    <p class="card-desc">Размышления о будущем технологий и духовном трезвении</p>
    </div>
    </div>
    </section>
  }
  </main>

  <app-footer></app-footer>
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
    // Авто-загрузка ключа при старте
    const savedKey = sessionStorage.getItem(this.API_KEY_STORAGE_KEY);
    if (savedKey) {
      this.api_key = savedKey;
      this.journalEntries.initializeWithApiKey(savedKey);
    }
  }

  onApiKeyChange(value: string) {
    this.api_key = value;
    if (value.trim() !== "") {
      sessionStorage.setItem(this.API_KEY_STORAGE_KEY, value);
      this.journalEntries.initializeWithApiKey(value);
    }
  }

  clearApiKey() {
    this.api_key = "";
    sessionStorage.removeItem(this.API_KEY_STORAGE_KEY);
    console.log("✅ Ключ удален.");
  }

  // Метод возврата (стрелочная функция для сохранения контекста)
  goBack = () => {
    this.selected_journal.set("");
  }

  // Методы выбора журналов
  select_dev_log() {
    this.checkKeyAndSelect("dev_log");
  }

  select_shekinah() {
    this.checkKeyAndSelect("shekinah");
  }

  select_ai_insights() {
    this.checkKeyAndSelect("ai_insights");
  }

  // Общий метод проверки ключа перед входом
  private checkKeyAndSelect(journalId: string) {
    if(this.api_key.trim() !== "") {
      this.selected_journal.set(journalId);
    } else {
      alert("Лев, сначала нужно ввести API ключ для связи с Близнецами!");
    }
  }
}
