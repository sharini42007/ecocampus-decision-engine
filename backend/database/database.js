import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

let dbInstance = null;

export function initDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  const dbDir = path.resolve(process.cwd(), 'backend', 'data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = path.join(dbDir, 'ecocampus.sqlite');

  // 1. Try better-sqlite3
  try {
    const BetterSqlite3 = require('better-sqlite3');
    const db = new BetterSqlite3(dbPath);
    db.pragma('journal_mode = WAL');
    dbInstance = {
      type: 'better-sqlite3',
      exec: (sql) => db.exec(sql),
      prepare: (sql) => {
        const stmt = db.prepare(sql);
        return {
          all: (...params) => stmt.all(...params),
          get: (...params) => stmt.get(...params),
          run: (...params) => stmt.run(...params)
        };
      }
    };
    return dbInstance;
  } catch (e1) {
    // 2. Try Node.js 22 built-in node:sqlite
    try {
      const { DatabaseSync } = require('node:sqlite');
      const db = new DatabaseSync(dbPath);
      dbInstance = {
        type: 'node:sqlite',
        exec: (sql) => db.exec(sql),
        prepare: (sql) => {
          const stmt = db.prepare(sql);
          return {
            all: (...params) => {
              const res = stmt.all(...params);
              return res || [];
            },
            get: (...params) => stmt.get(...params),
            run: (...params) => stmt.run(...params)
          };
        }
      };
      return dbInstance;
    } catch (e2) {
      console.error('Failed to load SQLite via better-sqlite3 and node:sqlite:', e2);
      throw new Error('SQLite engine not found: ' + e2.message);
    }
  }
}

export const getDatabase = initDatabase;
export default initDatabase;

