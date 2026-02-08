const { GoogleGenerativeAI } = require("@google/generative-ai");

// Твой ключ
const genAI = new GoogleGenerativeAI("AIzaSyAMf8sV0YXm7ITJAYeBqPcJYTliEEsLVfo");

async function listAllModels() {
    try {
        console.log("🔍 Начинаю поиск доступных моделей в чертогах Google...\n");

        // В Node.js SDK метод listModels обычно вызывается через итератор или прямое обращение
        // Однако, самый надежный способ в текущих версиях - через fetch или встроенный метод, если он обновлен
        // Но мы сделаем это правильно согласно документации SDK:

        // Примечание: В некоторых версиях SDK прямого метода listModels может не быть в главном классе,
        // тогда мы используем стандартный подход через REST-запрос, но давай попробуем официальный:

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${genAI.apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("✅ Найдены следующие модели:");
            console.table(data.models.map(m => ({
                Имя: m.name.replace('models/', ''),
                                                Описание: m.description,
                                                Методы: m.supportedGenerationMethods.join(', ')
            })));

            const hasFlash = data.models.find(m => m.name.includes("flash"));
            if (hasFlash) {
                console.log(`\n💡 Рекомендую использовать: ${hasFlash.name.replace('models/', '')}`);
            }
        } else {
            console.log("❌ Модели не найдены. Проверь API-ключ или ограничения аккаунта.");
            console.log("Ответ сервера:", data);
        }

    } catch (error) {
        console.error("❌ Ошибка при поиске моделей:", error.message);
    }
}

listAllModels();

/* Документация по моделям: https://ai.google.dev/api/rest/v1beta/models/list
 */
