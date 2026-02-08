import { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

interface JournalEntry {
  date: string;
  entry: string;
}

interface EntriesToSave {
  apiKey: string;
  dev_log: JournalEntry[];
  ai_insights: JournalEntry[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { apiKey, dev_log, ai_insights } = req.body as EntriesToSave;

    // Валидация
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    // Создаём уникальный ключ для каждого пользователя
    const storageKey = `journal_${Buffer.from(apiKey).toString('base64')}`;

    // Сохраняем данные в Redis
    const data = {
      dev_log: dev_log || [],
      ai_insights: ai_insights || [],
      lastUpdated: new Date().toISOString(),
    };

    await kv.set(storageKey, JSON.stringify(data), { 
      ex: 365 * 24 * 60 * 60 // Хранить 1 год
    });

    res.status(200).json({ 
      success: true, 
      message: 'Entries saved successfully',
      savedAt: data.lastUpdated
    });
  } catch (error) {
    console.error('Error saving entries:', error);
    res.status(500).json({ 
      error: 'Failed to save entries',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
