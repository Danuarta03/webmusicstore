//lib/db.ts

import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'mcc2', 
  password: '#Mobile24', 
  database: 'webmusicstore',
});
