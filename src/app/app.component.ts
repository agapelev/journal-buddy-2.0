// Copyright 2026 - Дневник разработки Льва и Gemini 3
// Адаптировано из оригинального Google LLC образца

import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JournalComponent } from './journal.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JournalComponent, FormsModule],
  template: `
  @if(this.api_key != "" && this.selected_journal() != "") {
    <app-journal [api_key]="api_key" [selected_journal]="selected_journal()" [goBack]="goBack()" />
  } @else {
    <div class="heading">
    <h1>Journal Buddy 2.0</h1>
    <p>Бортовой журнал разработчика: хроника взаимодействия с ИИ</p>
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
  `,
  styles: `
  * {
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    max-width: 800px;
  }
  .heading { margin-bottom: 30px; }
  .heading h1 {
    font-size:32px;
    margin:10px;
    color: #1a73e8;
  }
  .heading p {
    font-size:16px;
    color: #5f6368;
    margin: 10px;
  }
  .helper_text {
    font-size:14px;
    color: #888;
    margin: 10px;
    margin-top:40px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .gemini_api_key {
    padding:25px;
    border:2px solid #e8f0fe;
    border-radius: 12px;
    margin: 10px;
    background-color: #f8f9fa;
  }
  .gemini_api_key label {
    display:block;
    font-weight:bold;
    color: #1a73e8;
    margin-bottom: 8px;
  }
  .gemini_api_key input {
    width: 100%;
    font-size: 16px;
    padding: 10px;
    border: 1px solid #dadce0;
    border-radius: 6px;
    margin-top: 5px;
  }
  .api_key_help {
    font-size:12px;
    color: #70757a;
    margin-top: 8px;
  }
  .api_key_help a { color: #1a73e8; text-decoration: none; }
  .clear_key_btn {
    width: 100%;
    margin-top: 10px;
    padding: 8px 12px;
    background: #f1f3f4;
    border: 1px solid #dadce0;
    border-radius: 6px;
    color: #5f6368;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
  }
  .clear_key_btn:hover {
    background: #e8eaed;
    color: #202124;
  }
  .journals {
    padding: 20px;
    display: grid;
    gap: 20px;
  }
  .journals div {
    padding: 24px;
    border: 1px solid #dadce0;
    border-radius: 12px;
    transition: all 0.2s ease-in-out;
    background: white;
  }
  .journals div:hover {
    cursor: pointer;
    background: #f1f8ff;
    border: 1px solid #1a73e8;
    box-shadow: 0 4px 12px rgba(26,115,232,0.1);
    transform: translateY(-2px);
  }
  .journals div h2 {
    font-size:20px;
    margin: 0 0 10px 0;
    color: #202124;
  }
  .journals div p {
    font-size:14px;
    color: #5f6368;
    line-height: 1.5;
    margin: 0;
  }
  `
})
export class AppComponent implements OnInit {
  api_key = ""
  selected_journal = signal("")
  private readonly API_KEY_STORAGE_KEY = 'gemini_api_key_session';

  ngOnInit() {
    // 📚 Загружаем API ключ из SessionStorage при старте приложения
    const savedKey = sessionStorage.getItem(this.API_KEY_STORAGE_KEY);
    if (savedKey) {
      this.api_key = savedKey;
    }
  }

  // 💾 Сохраняем ключ в SessionStorage при изменении
  onApiKeyChange(value: string) {
    this.api_key = value;
    if (value.trim() !== "") {
      sessionStorage.setItem(this.API_KEY_STORAGE_KEY, value);
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
