/**
 * Скрипт: find-models.js
 * Назначение: Опрос Google API на предмет доступных моделей для вашего ключа.
 * Документация: https://ai.google.dev/api/models
 * * Назидание: "Просите, и дано будет вам; ищите, и найдете" (Мф. 7:7).
 * Мы ищем нужную модель, чтобы наш проект стоял на твердом основании актуальных технологий.
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Получаем API ключ из аргументов командной строки (--key=ВАШ_КЛЮЧ)
const args = process.argv.slice(2);
const keyArg = args.find(a => a.startsWith('--key='));
const API_KEY = keyArg ? keyArg.split('=')[1] : process.env.GOOGLE_API_KEY;

if (!API_KEY) {
    console.error("\x1b[31m%s\x1b[0m", "Ошибка: API ключ не найден!");
    console.log("Использование: node scripts/find-models.js --key=ВАШ_КЛЮЧ");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        console.log("\x1b[36m%s\x1b[0m", "⏳ Опрашиваю небесные чертоги Google API...");

        // В SDK метод listModels позволяет увидеть всё, что доступно вашему ключу
        const models = await genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" }); // заглушка для инициализации

        // Напрямую через клиент (более надежный способ для листинга)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        console.log("\x1b[32m%s\x1b[0m", "✅ Доступные модели найдены:\n");

        console.table(data.models.map(m => ({
            "ID модели": m.name.replace('models/', ''),
                                            "Описание": m.description,
                                            "Лимит токенов": m.inputTokenLimit
        })));

        console.log("\n\x1b[33m%s\x1b[0m", "💡 Совет:");
        console.log("Для нашего дневника используйте ID, где есть 'flash' — они быстрее и дешевле.");

    } catch (error) {
        console.error("\x1b[31m%s\x1b[0m", "❌ Произошел сбой при поиске:");
        console.error(error.message);
    }
}

listModels();
