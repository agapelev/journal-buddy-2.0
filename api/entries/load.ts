import { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

interface JournalEntry {
  date: string;
  entry: string;
}

interface StoredEntries {
  dev_log: JournalEntry[];
  ai_insights: JournalEntry[];
  lastUpdated: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Только GET запросы
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { apiKey } = req.query;

    // Валидация
    if (!apiKey || typeof apiKey !== 'string') {
      return res.status(400).json({ error: 'API key is required' });
    }

    // Создаём тот же ключ как в save
    const storageKey = `journal_${Buffer.from(apiKey).toString('base64')}`;

    // Загружаем данные из Redis
    const storedData = await kv.get(storageKey);

    if (!storedData) {
      // Если данных нет, возвращаем пустые массивы
      return res.status(200).json({
        dev_log: [],
        ai_insights: [],
        lastUpdated: null,
      });
    }

    // Парсим JSON данные
    const entries: StoredEntries = typeof storedData === 'string' 
      ? JSON.parse(storedData) 
      : storedData;

    res.status(200).json(entries);
  } catch (error) {
    console.error('Error loading entries:', error);
    res.status(500).json({ 
      error: 'Failed to load entries',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
