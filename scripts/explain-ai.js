const { GoogleGenerativeAI } = require("@google/generative-ai");

// Твой проверенный ключ
const genAI = new GoogleGenerativeAI("AIzaSyAMf8sV0YXm7ITJAYeBqPcJYTliEEsLVfo");

// Выбираем новейшую модель из твоего списка
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

async function run() {
    try {
        const prompt = "Расскажи о важности духовного трезвения в эпоху искусственного интеллекта.";
        console.log("📡 Соединение с Gemini 3 установлено. Ожидаю слово...");

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("\n📖 ОТКРОВЕНИЕ МОДЕЛИ:");
        console.log("-----------------------------------");
        console.log(text);
        console.log("-----------------------------------");
    } catch (error) {
        console.error("❌ Ошибка в чертогах:");
        console.error(error.message);
    }
}

run();
