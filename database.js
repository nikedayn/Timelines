import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('timelines.db');

export const initDB = async () => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        note TEXT,
        date TEXT NOT NULL,
        tag TEXT,
        media TEXT
      );
    `);
  } catch (error) {
    console.error("❌ БД ініціалізація:", error);
  }
};

const formatEvent = (event) => ({
  ...event,
  media: event.media ? JSON.parse(event.media) : []
});

export const getEvents = async () => {
  try {
    const results = await db.getAllAsync('SELECT * FROM events ORDER BY date DESC');
    return results.map(formatEvent);
  } catch (error) {
    return [];
  }
};

export const addEvent = async (title, note, date, tag, media) => {
  const mediaString = JSON.stringify(media || []);
  const dateString = date.toISOString();
  return await db.runAsync(
    'INSERT INTO events (title, note, date, tag, media) VALUES (?, ?, ?, ?, ?)',
    [title, note, dateString, tag, mediaString]
  );
};

export const deleteEvent = async (id) => {
  await db.runAsync('DELETE FROM events WHERE id = ?', [id]);
};

export const updateEvent = async (id, title, note, date, tag, media) => {
  const mediaString = JSON.stringify(media || []);
  const dateString = date.toISOString();
  return await db.runAsync(
    'UPDATE events SET title = ?, note = ?, date = ?, tag = ?, media = ? WHERE id = ?',
    [title, note, dateString, tag, mediaString, id]
  );
};

initDB();