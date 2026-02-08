// Copyright 2026 - Бортовой журнал Льва: Хроники Технологий и ИИ
import { Injectable, signal } from "@angular/core"

export interface JournalEntry {
    date: string;
    entry: string;
}

@Injectable({providedIn: "root"})
export class JournalEntries {

    /**
     * Используем сигналы (Signals) для реактивного обновления списка.
     * Это позволяет интерфейсу мгновенно перерисовываться при добавлении новой записи.
     */
    private dev_log_signal = signal<JournalEntry[]>([
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
    ]);

    private ai_insights_signal = signal<JournalEntry[]>([
        {
            "date": "2026-02-08",
            "entry": "--- \n philosophy: AI Symbiosis \n --- \n ИИ не заменяет человека, он масштабирует его интенцию. Если в сердце мир — ИИ поможет его распространить. Если хаос — ИИ его умножит. Цифровое трезвение начинается с осознанного выбора инструментов.",
        }
    ]);

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
        if (journal === 'dev_log') {
            this.dev_log_signal.update(entries => [entry, ...entries]);
        } else if (journal === 'ai_insights') {
            this.ai_insights_signal.update(entries => [entry, ...entries]);
        }
        console.log(`Запись добавлена в ${journal}:`, entry);
    }

    private blank_entries = [
        { "date": "2026-02-08", "entry": "Здесь пока пусто. Начните писать историю прямо сейчас!" }
    ];
}
