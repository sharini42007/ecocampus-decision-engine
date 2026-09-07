import { getDatabase } from '../database/database.js';

/**
 * Sustainability Score Calculation Algorithm
 *
 * Weights:
 * Electricity Efficiency = 20% (0.20)
 * Water Efficiency = 15% (0.15)
 * Waste Recycling = 20% (0.20)
 * Transportation = 15% (0.15)
 * Green Coverage = 15% (0.15)
 * Renewable Energy = 15% (0.15)
 *
 * Status thresholds:
 * 80 - 100: GREEN CAMPUS (or Excellent)
 * 60 - 79:  MODERATE (or Good)
 * 0  - 59:  NEEDS IMPROVEMENT
 */

export const WEIGHTS = {
  electricity: 0.20,
  water: 0.15,
  wasteRecycling: 0.20,
  transportation: 0.15,
  greenCoverage: 0.15,
  renewableEnergy: 0.15,
};

export function calculateScore(indicators) {
  const electricity = Number(indicators.electricity || indicators.electricity_consumption || 0);
  const water = Number(indicators.water || indicators.water_usage || 0);
  const waste = Number(indicators.wasteRecycling || indicators.waste_recycling_rate || 0);
  const transportation = Number(indicators.transportation || indicators.transportation_impact || 0);
  const green = Number(indicators.greenCoverage || indicators.green_coverage || 0);
  const renewable = Number(indicators.renewableEnergy || indicators.renewable_energy_usage || 0);

  const rawScore = (
    electricity * WEIGHTS.electricity +
    water * WEIGHTS.water +
    waste * WEIGHTS.wasteRecycling +
    transportation * WEIGHTS.transportation +
    green * WEIGHTS.greenCoverage +
    renewable * WEIGHTS.renewableEnergy
  );

  const score = Math.min(100, Math.max(0, Math.round(rawScore)));
  const status = getStatus(score);

  return { score, status, rawScore };
}

export function getStatus(score) {
  if (score >= 80) return 'GREEN CAMPUS';
  if (score >= 60) return 'MODERATE';
  return 'NEEDS IMPROVEMENT';
}

export function getDepartmentRankStatus(score) {
  if (score >= 88) return 'Excellent';
  if (score >= 78) return 'Good';
  return 'Needs Improvement';
}

/**
 * Recalculates department scores and campus overall score based on the latest records in SQLite
 */
export function syncAllScores() {
  const db = getDatabase();

  const depts = db.prepare('SELECT * FROM departments').all();

  for (const dept of depts) {
    const latestRecord = db.prepare(`
      SELECT * FROM sustainability_records 
      WHERE department_id = ? 
      ORDER BY record_date DESC, id DESC 
      LIMIT 1
    `).get(dept.id);

    if (latestRecord) {
      // Calculate score from record indicators
      const { score } = calculateScore({
        electricity: latestRecord.electricity_consumption,
        water: latestRecord.water_usage,
        wasteRecycling: latestRecord.waste_recycling_rate,
        transportation: latestRecord.transportation_impact,
        greenCoverage: latestRecord.green_coverage,
        renewableEnergy: latestRecord.renewable_energy_usage
      });

      const rankStatus = getDepartmentRankStatus(score);
      db.prepare('UPDATE departments SET score = ?, status = ? WHERE id = ?').run(score, rankStatus, dept.id);
    }
  }

  // Auto-detect and sync risk alerts
  import('./riskService.js').then(m => m.syncRiskAlerts()).catch(() => {});
}

export default {
  WEIGHTS,
  calculateScore,
  getStatus,
  getDepartmentRankStatus,
  syncAllScores
};
