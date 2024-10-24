// lib/db.ts
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Muat file .env
dotenv.config();

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'moonrayz',
  database: 'music_store_db',
});
