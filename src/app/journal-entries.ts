// Copyright 2026 - Бортовой журнал Льва: Хроники Технологий и ИИ
import { Injectable, signal, effect } from "@angular/core"
import { HttpClient } from "@angular/common/http";

export interface JournalEntry {
    date: string;
    entry: string;
}

interface StoredEntries {
    dev_log: JournalEntry[];
    ai_insights: JournalEntry[];
    lastUpdated?: string;
}

@Injectable({providedIn: "root"})
export class JournalEntries {
    private readonly STORAGE_KEY_DEV = 'journal_dev_log';
    private readonly STORAGE_KEY_AI = 'journal_ai_insights';
    private currentApiKey: string = '';

    // Дефолтные записи
    private readonly DEFAULT_DEV_LOG: JournalEntry[] = [
        {
            "date": "2026-02-08",
            "entry": "--- \n stack: Astro, Mantine, Svelte \n topic: UI Architecture \n --- \n Исследуем синергию Astro и Svelte. Astro идеально подходит для контентных сайтов (Школа Христа), а Svelte обеспечивает реактивность там, где она нужна. Mantine дает нам готовую библиотеку компонентов мирового уровня. Это 'святая троица' современного фронтенда.",
        },
        {
            "date": "2026-02-07",
            "entry": "--- \n tool: google-gemini-cli \n status: Active \n --- \n Настроили CLI для работы с Gemini прямо из терминала Fish. Теперь можно промптовать модель, не выходя из VS Code. Это ускоряет цикл разработки в разы. Инструмент позволяет автоматизировать создание документации и генерацию кода.",
        },
        {
            "date": "2026-02-06",
            "entry": "--- \n local_ai: Ollama, Llama 3 \n safety: High \n --- \n Развернули Ollama для локальных тестов. Когда нужно полное уединение (privacy) или нет доступа к сети, Ollama выручает. Сравнили ответы Llama 3 с Gemini 3 Flash. Gemini лидирует в логике, но Ollama хороша для быстрой локальной обработки текста.",
        },
        {
            "date": "2026-02-05",
            "entry": "--- \n workflow: Windsurf & VS Code \n --- \n Windsurf меняет правила игры. Его контекстное понимание проекта позволяет Gemini 3 видеть не только открытый файл, но и связи между компонентами. Исправили баг с CSP в Next.js, просто описав проблему своими словами.",
        },
        {
            "date": "2026-02-01",
            "entry": "--- \n project: Школа Христа \n goal: Structure \n --- \n Сформировали структуру каталогов. Серия 1 скоро будет перенесена из черновиков в основной проект на Astro. Используем Markdown для уроков — это просто, надежно и долговечно.",
        }
    ];

    private readonly DEFAULT_AI_INSIGHTS: JournalEntry[] = [
        {
            "date": "2026-02-08",
            "entry": "--- \n philosophy: AI Symbiosis \n --- \n ИИ не заменяет человека, он масштабирует его интенцию. Если в сердце мир — ИИ поможет его распространить. Если хаос — ИИ его умножит. Цифровое трезвение начинается с осознанного выбора инструментов.",
        }
    ];

    private dev_log_signal = signal<JournalEntry[]>([]);
    private ai_insights_signal = signal<JournalEntry[]>([]);
    private isInitialized = false;
    private isLoading = signal(false);
    private isSaving = signal(false);

    constructor(private http: HttpClient) {
        // Загружаем из локального storage при инициализации (fallback)
        this.loadFromLocalStorage();
        this.isInitialized = true;
        
        // 💾 Автоматически сохраняем на сервер при изменении сигналов
        effect(() => {
            if (!this.isInitialized || !this.currentApiKey) return;
            
            const devEntries = this.dev_log_signal();
            console.log('💾 Синхро Dev Log на сервер');
            this.saveToServer();
        });

        effect(() => {
            if (!this.isInitialized || !this.currentApiKey) return;
            
            const aiEntries = this.ai_insights_signal();
            console.log('💾 Синхро AI Insights на сервер');
            this.saveToServer();
        });
    }

    /**
     * Инициализируем данные с сервера когда задан API key
     */
    async initializeWithApiKey(apiKey: string) {
        this.currentApiKey = apiKey;
        console.log('🔑 Инициализирую со следующим API key');
        await this.loadFromServer();
    }

    /**
     * Загружаем данные с сервера по API
     */
    private async loadFromServer() {
        if (!this.currentApiKey) {
            console.log('ℹ️ API key не задан, пропускаю загрузку с сервера');
            return;
        }

        try {
            this.isLoading.set(true);
            console.log('📡 Загружаю записи с сервера...');
            
            const response = await this.http.get<StoredEntries>('/api/entries/load', {
                params: { apiKey: this.currentApiKey }
            }).toPromise();

            if (response) {
                console.log('✅ Загружены с сервера:', {
                    dev_log: response.dev_log?.length,
                    ai_insights: response.ai_insights?.length
                });
                
                this.dev_log_signal.set(response.dev_log || this.DEFAULT_DEV_LOG);
                this.ai_insights_signal.set(response.ai_insights || this.DEFAULT_AI_INSIGHTS);
                
                // Обновляем localStorage как кэш
                localStorage.setItem(this.STORAGE_KEY_DEV, JSON.stringify(this.dev_log_signal()));
                localStorage.setItem(this.STORAGE_KEY_AI, JSON.stringify(this.ai_insights_signal()));
            }
        } catch (error) {
            console.error('❌ Ошибка при загрузке с сервера:', error);
            // Fallback на локальные данные
            this.loadFromLocalStorage();
        } finally {
            this.isLoading.set(false);
        }
    }

    /**
     * Загружаем данные из локального кэша (localStorage)
     */
    private loadFromLocalStorage() {
        try {
            console.log('📂 Загружаю данные из LocalStorage...');
            
            const devStored = localStorage.getItem(this.STORAGE_KEY_DEV);
            if (devStored && devStored.trim()) {
                const parsed = JSON.parse(devStored);
                console.log('✅ Найдены Dev Log записи:', parsed.length);
                this.dev_log_signal.set(parsed);
            } else {
                console.log('ℹ️ Dev Log в localStorage не найден, использую дефолтные');
                this.dev_log_signal.set(this.DEFAULT_DEV_LOG);
            }

            const aiStored = localStorage.getItem(this.STORAGE_KEY_AI);
            if (aiStored && aiStored.trim()) {
                const parsed = JSON.parse(aiStored);
                console.log('✅ Найдены AI Insights записи:', parsed.length);
                this.ai_insights_signal.set(parsed);
            } else {
                console.log('ℹ️ AI Insights в localStorage не найден, использую дефолтные');
                this.ai_insights_signal.set(this.DEFAULT_AI_INSIGHTS);
            }
        } catch (error) {
            console.error('❌ Ошибка при загрузке из LocalStorage:', error);
            this.dev_log_signal.set(this.DEFAULT_DEV_LOG);
            this.ai_insights_signal.set(this.DEFAULT_AI_INSIGHTS);
        }
    }

    /**
     * Сохраняем на сервер
     */
    private async saveToServer() {
        if (!this.currentApiKey) return;

        try {
            this.isSaving.set(true);
            console.log('📡 Сохраняю записи на сервер...');
            
            await this.http.post('/api/entries/save', {
                apiKey: this.currentApiKey,
                dev_log: this.dev_log_signal(),
                ai_insights: this.ai_insights_signal()
            }).toPromise();

            console.log('✅ Записи успешно сохранены на сервер');
        } catch (error) {
            console.error('❌ Ошибка при сохранении на сервер:', error);
            // LocalStorage служит резервным хранилищем
            this.fallbackToLocalStorage();
        } finally {
            this.isSaving.set(false);
        }
    }

    /**
     * Fallback: сохраняем локально если сервер недоступен
     */
    private fallbackToLocalStorage() {
        try {
            console.log('⚠️ Сохраняю локально как fallback');
            localStorage.setItem(this.STORAGE_KEY_DEV, JSON.stringify(this.dev_log_signal()));
            localStorage.setItem(this.STORAGE_KEY_AI, JSON.stringify(this.ai_insights_signal()));
            console.log('✅ Локальное сохранение выполнено');
        } catch (e) {
            console.error('❌ Ошибка при локальном сохранении:', e);
        }
    }

    /**
     * Инициализируем данные из LocalStorage при старте
     */
    private initializeFromStorage() {
        try {
            console.log('📂 Загружаю данные из LocalStorage...');
            
            const devStored = localStorage.getItem(this.STORAGE_KEY_DEV);
            if (devStored && devStored.trim()) {
                const parsed = JSON.parse(devStored);
                console.log('✅ Найдены Dev Log записи:', parsed.length);
                this.dev_log_signal.set(parsed);
            } else {
                console.log('ℹ️ Dev Log в localStorage не найден, использую дефолтные');
                this.dev_log_signal.set(this.DEFAULT_DEV_LOG);
            }

            const aiStored = localStorage.getItem(this.STORAGE_KEY_AI);
            if (aiStored && aiStored.trim()) {
                const parsed = JSON.parse(aiStored);
                console.log('✅ Найдены AI Insights записи:', parsed.length);
                this.ai_insights_signal.set(parsed);
            } else {
                console.log('ℹ️ AI Insights в localStorage не найден, использую дефолтные');
                this.ai_insights_signal.set(this.DEFAULT_AI_INSIGHTS);
            }
            
            this.isInitialized = true;
            console.log('✅ Инициализация завершена');
        } catch (error) {
            console.error('❌ Ошибка при загрузке из LocalStorage:', error);
            this.dev_log_signal.set(this.DEFAULT_DEV_LOG);
            this.ai_insights_signal.set(this.DEFAULT_AI_INSIGHTS);
            this.isInitialized = true;
        }
    }

    getEntries(selected_journal: string) {
        if(selected_journal == "dev_log") return this.dev_log_signal();
        if(selected_journal == "ai_insights") return this.ai_insights_signal();
        return this.blank_entries;
    }

    /**
     * Метод для динамического добавления записей из интерфейса.
     * Назидание: "Доброе имя лучше большого богатства" (Притч. 22:1).
     * Сохраняй каждое свое техническое открытие — это твой цифровой капитал.
     */
    addEntryToJournal(journal: string, entry: JournalEntry) {
        console.log(`➕ Добавляю запись в ${journal}:`, entry);
        
        if (journal === 'dev_log') {
            this.dev_log_signal.update(entries => {
                const updated = [entry, ...entries];
                try {
                    localStorage.setItem(this.STORAGE_KEY_DEV, JSON.stringify(updated));
                    console.log('💾 Немедленно сохранил Dev Log в LocalStorage:', updated.length);
                } catch (e) {
                    console.error('Ошибка при немедленном сохранении Dev Log:', e);
                }
                return updated;
            });
        } else if (journal === 'ai_insights') {
            this.ai_insights_signal.update(entries => {
                const updated = [entry, ...entries];
                try {
                    localStorage.setItem(this.STORAGE_KEY_AI, JSON.stringify(updated));
                    console.log('💾 Немедленно сохранил AI Insights в LocalStorage:', updated.length);
                } catch (e) {
                    console.error('Ошибка при немедленном сохранении AI Insights:', e);
                }
                return updated;
            });
        }
    }

    private blank_entries = [
        { "date": "2026-02-08", "entry": "Здесь пока пусто. Начните писать историю прямо сейчас!" }
    ];
}
