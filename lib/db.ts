import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // Sesuaikan dengan user MySQL kamu
  password: 'moonrayz', // Pastikan password benar
  database: 'webmusicstore',
});
