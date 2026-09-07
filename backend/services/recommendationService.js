import { getDatabase } from '../database/database.js';

export function getRecommendations(filter = 'All') {
  const db = getDatabase();
  let query = 'SELECT * FROM recommendations';
  const params = [];

  if (filter && filter !== 'All') {
    query += ' WHERE UPPER(priority) = UPPER(?)';
    params.push(filter);
  }

  query += ` ORDER BY 
    CASE priority 
      WHEN 'HIGH' THEN 1 
      WHEN 'MEDIUM' THEN 2 
      WHEN 'LOW' THEN 3 
      ELSE 4 
    END, id ASC`;

  const recs = db.prepare(query).all(...params);
  return recs;
}

export default {
  getRecommendations
};
