// Copyright 2026 - Основной компонент управления дневником Льва
import { Component, inject, Input, signal } from '@angular/core';
import { EntryComponent } from './entry.component';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { JournalEntries } from './journal-entries';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-journal',
    standalone: true,
    imports: [EntryComponent, FormsModule],
    template: `
    <div class="header_nav">
    <div class="back_button" (click)="goBack()">← К выбору журналов</div>
    <div class="journal_title">Выбран: {{ selected_journal === 'dev_log' ? '🛠 Dev Log' : '🧠 AI Insights' }}</div>
    </div>

    <div class="add_entry_box">
    <h3>Записать новое событие</h3>
    <textarea [(ngModel)]="newEntryText" placeholder="Что произошло сегодня в разработке?"></textarea>
    <button class="save_btn" (click)="addNewEntry()">Сохранить в дневник</button>
    </div>

    <div class="question_box">
    <div class="error_message" [hidden]="error_message.length == 0">
    {{error_message}}
    </div>
    <label for="question">Спросите Gemini о ваших записях</label>
    <input type="text" name="question" [(ngModel)]="question" (keyup)="inputChanged($event)"
    placeholder="Например: Какие баги мы исправили вчера?" />
    <button class="ask_btn" (click)="ask_question()">Спросить Близнецов</button>

    <div class="helper_heading">Идеи для вопросов:</div>
    <ul class="helper_list">
    <li (click)="ask('Сделай краткий обзор моих успехов за последнюю неделю')">Обзор успехов за неделю</li>
    <li (click)="ask('Какие технические сложности у меня возникали чаще всего?')">Анализ сложностей</li>
    <li (click)="ask('На основе моих записей, какой следующий шаг в обучении мне стоит сделать?')">Совет по обучению</li>
    </ul>
    </div>

    <div class="loading" [hidden]="!loading">
    <div class="spinner"></div> Думаю над ответом...
    </div>

    <div class="answer_box" [hidden]="answer.length == 0">
    <h1 [hidden]="!valid_answer">Ответ Gemini 3:</h1>
    @for(answerLine of answer.split("\n");track answerLine) {
        <p>{{answerLine}}</p>
    }
    </div>

    <h1 class="journal_entries_header">Летопись событий:</h1>
    <div class="entries_container">
    @for(entry of journalEntries.getEntries(this.selected_journal);track entry) {
        <app-entry [entry]="entry" />
    }
    </div>
    `,
    styles: `
    :host { font-family: 'Segoe UI', system-ui, sans-serif; }
    .header_nav { display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; }
    .back_button { font-size:12px; font-weight: bold; padding: 6px 12px; background-color: #f1f3f4; border-radius: 20px; cursor: pointer; }
    .back_button:hover { background-color: #e8eaed; }
    .journal_title { font-weight: bold; color: #1a73e8; }

    .add_entry_box { padding: 20px; margin: 20px; background: #fff; border: 1px solid #dadce0; border-radius: 12px; }
    .add_entry_box textarea { width: 100%; height: 80px; padding: 10px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 10px; resize: vertical; }
    .save_btn { background: #34a853; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }

    .question_box { padding:20px; border: 1px solid #1a73e8; border-radius: 12px; margin: 20px; background: #f8fbff; }
    .question_box label { display:block; font-weight:bold; margin-bottom:8px; color: #1a73e8; }
    .question_box input { width: 100%; font-size: 16px; padding: 10px; border: 1px solid #dadce0; border-radius: 8px; margin-bottom: 12px; }
    .ask_btn { background: #1a73e8; border: none; border-radius: 6px; padding: 10px 20px; color: #fff; font-weight: bold; cursor: pointer; }

    .error_message { padding:10px; margin-bottom: 10px; background:#d93025; border-radius: 6px; color: white; }
    .answer_box { padding: 20px; margin: 20px; border-radius: 12px; background: #f1f3f4; border-left: 6px solid #1a73e8; }
    .answer_box h1 { font-size: 18px; color: #1a73e8; margin-bottom: 10px; }

    .loading { text-align: center; padding: 20px; color: #1a73e8; font-weight: bold; }
    .helper_heading { margin-top:15px; font-size:14px; font-weight:bold; }
    .helper_list { font-size:14px; color: #1a73e8; cursor: pointer; list-style-type: none; padding: 0; }
    .helper_list li { margin-top: 5px; text-decoration: underline; }
    .journal_entries_header { margin: 20px; font-size: 22px; }
    `
})
export class JournalComponent {
    @Input() api_key = ""
    @Input() selected_journal = ""
    @Input() goBack = () => {}

    journalEntries = inject(JournalEntries);

    newEntryText = ""; // Текст новой записи
    question = "";
    answer = "";
    valid_answer = false;
    error_message = "";
    loading = false;

    /**
     * НАЗИДАНИЕ: "Всякий, слышащий слова сии и исполняющий их,
     * уподобится мужу благоразумному" (Мф. 7:24).
     * Мы добавляем метод сохранения, чтобы твои труды не пропали впустую.
     */
    addNewEntry() {
        if (!this.newEntryText.trim()) return;

        const today = new Date().toISOString().split('T')[0];
        const newEntry = {
            date: today,
            entry: `--- \n status: Logged \n --- \n ${this.newEntryText}`
        };

        // Вызываем метод сервиса (его мы обновим в следующем файле)
        this.journalEntries.addEntryToJournal(this.selected_journal, newEntry);
        this.newEntryText = "";
    }

    inputChanged(e: KeyboardEvent) {
        if(e.key == "Enter") this.ask_question();
        if(this.question != "") this.error_message = "";
    }

    async ask_question() {
        if(this.question == "") {
            this.error_message = "Пожалуйста, введите вопрос для Gemini.";
            return;
        }
        await this.ask(this.question);
    }

    async ask(question_to_ask: string) {
        this.question = question_to_ask;
        this.error_message = "";
        
        // Проверка API ключа перед запросом
        if(!this.api_key || this.api_key.trim().length === 0) {
            this.error_message = "❌ Отсутствует API ключ. Вернитесь на главный экран и введите ключ.";
            return;
        }
        
        if(this.api_key.trim().length < 20) {
            this.error_message = "⚠️ API ключ слишком короткий. Проверьте его правильность.";
            return;
        }

        this.loading = true;
        const today = new Date().toLocaleDateString('ru-RU');

        let prompt = `Сегодня: ${today}. Ты — мудрый помощник по анализу дневника разработчика. В конце сообщения я дам тебе записи. Ответь кратко на вопрос: ${question_to_ask}. Если записей много, используй список. Вот записи:\n`;

        for(let entry of this.journalEntries.getEntries(this.selected_journal)) {
            prompt += `${entry.date}\n${entry.entry}\n\n`;
        }

        const geminiOutput = await this.callGemini(prompt);
        this.loading = false;

        if(geminiOutput == "-1") {
            this.answer = "❌ Не удалось получить ответ от Gemini. Проверьте подключение к интернету и попробуйте еще раз.";
            this.valid_answer = false;
            this.error_message = "Ошибка при запросе к Gemini";
        } else if(geminiOutput == "-2") {
            this.answer = "🔴 Ошибка API ключа. Убедитесь, что ключ введен правильно и имеет необходимые разрешения. Вернитесь на главный экран и проверьте ключ.";
            this.valid_answer = false;
            this.error_message = "Неверный или истекший API ключ";
        } else {
            this.answer = geminiOutput;
            this.valid_answer = true;
        }
    }

    async callGemini(prompt: string) {
        if (!this.api_key || this.api_key.trim().length === 0) {
            return "-2"; // Ошибка ключа API
        }

        const genAI = new GoogleGenerativeAI(this.api_key);
        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
        
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            if (!text || text.trim().length === 0) {
                console.warn('Gemini вернул пустой ответ');
                return "-1";
            }
            
            return text;
        } catch(error: any) {
            console.error('Ошибка при запросе к Gemini:', error);
            
            // Более точная диагностика ошибок
            const errorMessage = error?.message || String(error);
            const statusCode = error?.status;
            
            // Проверяем конкретные причины ошибки
            if (errorMessage.includes('API key') || errorMessage.includes('API_KEY_INVALID') || statusCode === 401) {
                console.error('🔴 Ошибка валидации API ключа. Проверьте правильность ключа.');
                return "-2";
            }
            
            if (errorMessage.includes('quota') || statusCode === 429) {
                console.error('⚠️ Исчерпана квота запросов. Попробуйте позже.');
                return "-1";
            }
            
            if (statusCode === 403) {
                console.error('🚫 Доступ запрещен. Проверьте разрешения API ключа.');
                return "-2";
            }
            
            console.error('❌ Неизвестная ошибка:', errorMessage);
            return "-1";
        }
    }
}
