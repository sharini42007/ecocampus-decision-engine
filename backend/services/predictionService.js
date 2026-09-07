import { getDatabase } from '../database/database.js';

export function getPredictions(timeHorizon = '6 Months') {
  const currentScore = 87;

  // Predefined milestone progressions based on campus sustainability action plan
  const timeHorizons = {
    '1 Month': {
      predictedScore: 89,
      improvement: 2,
      label: '1 Month Horizon',
      milestones: [
        'Occupancy sensor rollout in IT/ECE computer labs completed',
        'Single-use plastic reduction awareness and initial bin placement',
        'Campus water leak audit & low-flow fixture repairs in mechanical block'
      ]
    },
    '3 Months': {
      predictedScore: 91,
      improvement: 4,
      label: '3 Months Horizon',
      milestones: [
        'Phase 1 Rooftop Solar installation commissioned (100 kW)',
        'Workshop scrap metal recycling tie-up with authorized green vendors',
        'Greywater filtration system active for campus gardening'
      ]
    },
    '6 Months': {
      predictedScore: 94,
      improvement: 7,
      label: '6 Months Horizon (Solar Installation Milestone)',
      milestones: [
        'Full 250 kW Solar Array fully operational across academic blocks',
        'Campus-wide IoT sub-metering integrated into decision engine',
        'Mechanical department green efficiency protocols in active enforcement',
        '500 native saplings established along perimeter sports fields'
      ]
    },
    '1 Year': {
      predictedScore: 96,
      improvement: 9,
      label: '1 Year Long-term Target',
      milestones: [
        'Net-zero electricity status during peak sunshine hours',
        '100% mechanical and laboratory scrap circular economy pipeline',
        'Autonomous electric shuttle pilot operational on ring road',
        'Zero single-use plastic certified campus status'
      ]
    }
  };

  const selected = timeHorizons[timeHorizon] || timeHorizons['6 Months'];

  // Historical trajectory + future forecasted points for charts
  const timelineData = [
    { period: 'Jan 2026', score: 78, type: 'historical' },
    { period: 'Feb 2026', score: 80, type: 'historical' },
    { period: 'Mar 2026', score: 81, type: 'historical' },
    { period: 'Apr 2026', score: 83, type: 'historical' },
    { period: 'May 2026', score: 85, type: 'historical' },
    { period: 'Jun 2026 (Current)', score: 87, type: 'current' },
    { period: '+1 Month', score: 89, type: 'predicted' },
    { period: '+3 Months', score: 91, type: 'predicted' },
    { period: '+6 Months', score: 94, type: 'predicted' },
    { period: '+1 Year', score: 96, type: 'predicted' }
  ];

  return {
    currentScore,
    predictedScore: selected.predictedScore,
    improvement: selected.improvement,
    timeHorizon,
    selectedHorizonDetails: selected,
    allHorizons: timeHorizons,
    timelineData,
    modelDescription: 'Prototype prediction is calculated using current sustainability indicators and predefined improvement assumptions.',
    primaryMilestone: 'Solar Installation Target (+7 Improvement from 87 to 94 at 6 Months)'
  };
}

export function savePredictionRecord(data) {
  const db = getDatabase();
  const insert = db.prepare(`
    INSERT INTO predictions (scenario_name, current_score, predicted_score, improvement, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  const res = insert.run(
    data.scenario_name || 'Custom Scenario Prediction',
    data.current_score || 87,
    data.predicted_score || 94,
    data.improvement || 7,
    new Date().toISOString()
  );
  return { id: res.lastInsertRowid, ...data };
}

export default {
  getPredictions,
  savePredictionRecord
};
