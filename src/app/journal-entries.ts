// Copyright 2026 - Бортовой журнал Льва: Хроники Технологий и ИИ
import { Injectable, signal, effect } from "@angular/core"
import { HttpClient } from "@angular/common/http";

export interface JournalEntry {
    date: string;
    entry: string;
}

interface StoredEntries {
    dev_log: JournalEntry[];
    shekinah: JournalEntry[]; // Добавил в интерфейс
    ai_insights: JournalEntry[];
    lastUpdated?: string;
}

@Injectable({providedIn: "root"})
export class JournalEntries {
    private readonly STORAGE_KEY_DEV = 'journal_dev_log';
    private readonly STORAGE_KEY_SHE = 'journal_shekinah';
    private readonly STORAGE_KEY_AI = 'journal_ai_insights';
    private currentApiKey: string = '';

    // Дефолтные записи
    private readonly DEFAULT_DEV_LOG: JournalEntry[] = [
        {
            "date": "2026-02-08",
            "entry": "--- \n stack: Astro, Mantine, Svelte \n topic: UI Architecture \n --- \n Исследуем синергию Astro и Svelte. Astro идеально подходит для контентных сайтов (Школа Христа), а Svelte обеспечивает реактивность там, где она нужна. Mantine дает нам готовую библиотеку компонентов мирового уровня.",
        }
    ];

    private readonly DEFAULT_SHEKINAH: JournalEntry[] = [
        {
            "date": "2026-02-08",
            "entry": "Начало хроник Mission Shekinah. Свет во тьме светит."
        }
    ];

    private readonly DEFAULT_AI_INSIGHTS: JournalEntry[] = [
        {
            "date": "2026-02-08",
            "entry": "--- \n philosophy: AI Symbiosis \n --- \n ИИ не заменяет человека, он масштабирует его интенцию."
        }
    ];

    private dev_log_signal = signal<JournalEntry[]>([]);
    private shekinah_signal = signal<JournalEntry[]>([]);
    private ai_insights_signal = signal<JournalEntry[]>([]);
    private isInitialized = false;
    private isLoading = signal(false);
    private isSaving = signal(false);

    constructor(private http: HttpClient) {
        this.loadFromLocalStorage();
        this.isInitialized = true;

        // 💾 Автоматически сохраняем на сервер при изменении сигналов
        effect(() => {
            if (!this.isInitialized || !this.currentApiKey) return;
            this.dev_log_signal();
            console.log('💾 Синхро Dev Log на сервер');
            this.saveToServer();
        });

        effect(() => {
            if (!this.isInitialized || !this.currentApiKey) return;
            this.ai_insights_signal();
            console.log('💾 Синхро AI Insights на сервер');
            this.saveToServer();
        });

        effect(() => {
            if (!this.isInitialized || !this.currentApiKey) return;
            this.shekinah_signal();
            console.log('⛪ Синхро Mission Shekinah на сервер');
            this.saveToServer();
        });
    }

    async initializeWithApiKey(apiKey: string) {
        this.currentApiKey = apiKey;
        console.log('🔑 Инициализирую со следующим API key');
        await this.loadFromServer();
    }

    private async loadFromServer() {
        if (!this.currentApiKey) return;

        try {
            this.isLoading.set(true);
            const response = await this.http.get<StoredEntries>('/api/entries/load', {
                params: { apiKey: this.currentApiKey }
            }).toPromise();

            if (response) {
                this.dev_log_signal.set(response.dev_log || this.DEFAULT_DEV_LOG);
                this.shekinah_signal.set(response.shekinah || this.DEFAULT_SHEKINAH);
                this.ai_insights_signal.set(response.ai_insights || this.DEFAULT_AI_INSIGHTS);

                this.fallbackToLocalStorage(); // Обновляем кэш
            }
        } catch (error) {
            console.error('❌ Ошибка при загрузке с сервера:', error);
            this.loadFromLocalStorage();
        } finally {
            this.isLoading.set(false);
        }
    }

    private loadFromLocalStorage() {
        try {
            const devStored = localStorage.getItem(this.STORAGE_KEY_DEV);
            this.dev_log_signal.set(devStored ? JSON.parse(devStored) : this.DEFAULT_DEV_LOG);

            const sheStored = localStorage.getItem(this.STORAGE_KEY_SHE);
            this.shekinah_signal.set(sheStored ? JSON.parse(sheStored) : this.DEFAULT_SHEKINAH);

            const aiStored = localStorage.getItem(this.STORAGE_KEY_AI);
            this.ai_insights_signal.set(aiStored ? JSON.parse(aiStored) : this.DEFAULT_AI_INSIGHTS);
        } catch (error) {
            this.dev_log_signal.set(this.DEFAULT_DEV_LOG);
            this.shekinah_signal.set(this.DEFAULT_SHEKINAH);
            this.ai_insights_signal.set(this.DEFAULT_AI_INSIGHTS);
        }
    }

    private async saveToServer() {
        if (!this.currentApiKey) return;

        try {
            this.isSaving.set(true);
            await this.http.post('/api/entries/save', {
                apiKey: this.currentApiKey,
                dev_log: this.dev_log_signal(),
                                 shekinah: this.shekinah_signal(),
                                 ai_insights: this.ai_insights_signal()
            }).toPromise();
        } catch (error) {
            this.fallbackToLocalStorage();
        } finally {
            this.isSaving.set(false);
        }
    }

    private fallbackToLocalStorage() {
        localStorage.setItem(this.STORAGE_KEY_DEV, JSON.stringify(this.dev_log_signal()));
        localStorage.setItem(this.STORAGE_KEY_SHE, JSON.stringify(this.shekinah_signal()));
        localStorage.setItem(this.STORAGE_KEY_AI, JSON.stringify(this.ai_insights_signal()));
    }

    getEntries(selected_journal: string) {
        if(selected_journal === "dev_log") return this.dev_log_signal();
        if(selected_journal === "shekinah") return this.shekinah_signal();
        if(selected_journal === "ai_insights") return this.ai_insights_signal();
        return this.blank_entries;
    }

    addEntryToJournal(journal: string, entry: JournalEntry) {
        if (journal === 'dev_log') {
            this.dev_log_signal.update(e => [entry, ...e]);
        } else if (journal === 'shekinah') {
            this.shekinah_signal.update(e => [entry, ...e]);
        } else if (journal === 'ai_insights') {
            this.ai_insights_signal.update(e => [entry, ...e]);
        }
        this.fallbackToLocalStorage();
    }

    private blank_entries = [{ "date": "2026-02-08", "entry": "Здесь пока пусто." }];
}
