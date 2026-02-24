// src/app/core/config/journals.config.ts

export interface Journal {
    id: string;
    name: string;
    icon: string;
    desc: string;
}

export const JOURNALS_LIST: Journal[] = [
    { id: 'shekhinah', name: '🕊️ Миссия Шехина', icon: '✨', desc: 'Свет во тьме миссии' },
{ id: 'christ_school', name: '📖 Школа Христа', icon: '🙏', desc: 'Уроки духовного роста' },
{ id: 'ai_wisdom', name: '🤖 AI Назидания', icon: '🧠', desc: 'Мудрость и Близнецы' },
{ id: 'dev_log', name: '🛠 Angular Dev', icon: '🅰️', desc: 'Архитектура и реактивность' },
{ id: 'astro', name: '🚀 Astro Project', icon: '🪐', desc: 'Космическая верстка' },
{ id: 'next_logic', name: '⚛️ Next & Nextra', icon: '📦', desc: 'Логика фреймворков' },
{ id: 'styling_art', name: '🎨 Tailwind & Mantine', icon: '🖌️', desc: 'Искусство интерфейса' }
];


export interface Journal {
    id: string;
    title: string;
    icon: string;
    description: string;
    category: 'spiritual' | 'technical' | 'ai';
}

export const JOURNALS: Journal[] = [
    // ДУХОВНЫЕ ЖУРНАЛЫ
    { id: 'shekhinah', title: 'Миссия Шехина', icon: '✨', description: 'Летопись духовного делания и миссионерских планов.', category: 'spiritual' },
{ id: 'christ-school', title: 'Школа Христа', icon: '⛪', description: 'Уроки, принципы и назидания из курса Школы Христа.', category: 'spiritual' },

// ИИ И МУДРОСТЬ
{ id: 'ai-wisdom', title: 'AI Назидания и Мудрость', icon: '🤖', description: 'Диалоги с Близнецами о вечном и синтез ИИ-философии.', category: 'ai' },

// ТЕХНИЧЕСКИЙ СТЕК
{ id: 'angular', title: 'Angular', icon: '🅰️', description: 'Заметки по архитектуре и reactive-программированию.', category: 'technical' },
{ id: 'astro', title: 'Astro', icon: '🚀', description: 'Оптимизация статических сайтов и островов.', category: 'technical' },
{ id: 'next-nextra', title: 'Next & Nextra', icon: '⚛️', description: 'Разработка на Next.js и создание документации.', category: 'technical' },
{ id: 'styling', title: 'Tailwind & Mantine', icon: '🎨', description: 'Искусство верстки и UI-компонентов.', category: 'technical' }
];




// Прямо в начало класса добавляем наш список
journals = [
    { id: 'shekhinah', title: 'Миссия Шехина', icon: '✨', desc: 'Летопись духовного делания.' },
{ id: 'christ-school', title: 'Школа Христа', icon: '⛪', desc: 'Принципы веры.' },
{ id: 'ai-wisdom', title: 'AI Назидания', icon: '🤖', desc: 'Синтез ИИ и Мудрости.' },
{ id: 'angular', title: 'Angular', icon: '🅰️', desc: 'Reactive development.' },
{ id: 'astro', title: 'Astro', icon: '🚀', desc: 'Static islands.' },
{ id: 'next', title: 'Next & Nextra', icon: '⚛️', desc: 'Frameworks.' },
{ id: 'styling', title: 'Tailwind & Mantine', icon: '🎨', desc: 'Art of UI.' }
];

// Переменная для хранения текущего выбранного журнала
currentJournalId = 'shekhinah';

// Метод для переключения (вызывается при клике)
selectJournal(id: string) {
    this.currentJournalId = id;
    this.loadEntries(); // Перезагружаем записи для выбранного журнала
}
