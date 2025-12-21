import * as SQLite from 'expo-sqlite';

// 1. Відкриваємо базу даних
const db = SQLite.openDatabaseSync('timelines.db');

/**
 * Ініціалізація бази даних.
 * Створює таблицю, якщо вона не існує.
 */
export const initDB = () => {
  try {
    db.execSync(`
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
    console.log("✅ База даних успішно ініціалізована");
  } catch (error) {
    console.error("❌ Помилка ініціалізації БД:", error);
  }
};

/**
 * Додавання нової події
 * @param {string} title - Назва події
 * @param {string} note - Опис/Нотатка
 * @param {Date} date - Об'єкт дати
 * @param {string} tag - Тег (Особисте, Робота тощо)
 * @param {Array} media - Масив шляхів до медіафайлів (URI)
 */
export const addEvent = (title, note, date, tag, media) => {
  try {
    const mediaString = JSON.stringify(media || []);
    const dateString = date.toISOString();

    return db.runSync(
      'INSERT INTO events (title, note, date, tag, media) VALUES (?, ?, ?, ?, ?)',
      [title, note, dateString, tag, mediaString]
    );
  } catch (error) {
    console.error("❌ Помилка при додаванні події:", error);
    throw error;
  }
};

/**
 * Отримання всіх подій із сортуванням за датою (від нових до старих)
 */
export const getEvents = () => {
  try {
    const results = db.getAllSync('SELECT * FROM events ORDER BY date DESC');
    return results;
  } catch (error) {
    console.error("❌ Помилка при отриманні подій:", error);
    // Якщо таблиці немає, повертаємо порожній масив, щоб додаток не "падав"
    return [];
  }
};

/**
 * Видалення події за ID
 */
export const deleteEvent = (id) => {
  try {
    db.runSync('DELETE FROM events WHERE id = ?', [id]);
    console.log(`🗑️ Подію ID:${id} видалено`);
  } catch (error) {
    console.error("❌ Помилка при видаленні події:", error);
  }
};

export const updateEvent = (id, title, note, date, tag, media) => {
  try {
    const mediaString = JSON.stringify(media || []);
    const dateString = date.toISOString();

    return db.runSync(
      'UPDATE events SET title = ?, note = ?, date = ?, tag = ?, media = ? WHERE id = ?',
      [title, note, dateString, tag, mediaString, id]
    );
  } catch (error) {
    console.error("❌ Помилка при оновленні події:", error);
    throw error;
  }
};

// Викликаємо ініціалізацію одразу при імпорті файлу
initDB();