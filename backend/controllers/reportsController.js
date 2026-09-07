import { getDatabase } from '../database/database.js';
import { getRiskAlerts } from '../services/riskService.js';
import { getPredictions } from '../services/predictionService.js';
import { getRecommendations } from '../services/recommendationService.js';
import { simulateScenario } from '../services/scenarioService.js';

export function getComprehensiveReport(req, res) {
  try {
    const db = getDatabase();

    const departments = db.prepare('SELECT * FROM departments ORDER BY score DESC').all();

    const records = db.prepare(`
      SELECT 
        r.*, 
        d.name as department 
      FROM sustainability_records r
      JOIN departments d ON r.department_id = d.id
      ORDER BY r.record_date DESC, r.id DESC
    `).all();

    const avgStats = db.prepare(`
      SELECT 
        ROUND(AVG(electricity_consumption)) as avg_electricity,
        ROUND(AVG(water_usage)) as avg_water,
        ROUND(AVG(waste_recycling_rate)) as avg_waste,
        ROUND(AVG(transportation_impact)) as avg_transport,
        ROUND(AVG(green_coverage)) as avg_green,
        ROUND(AVG(renewable_energy_usage)) as avg_renewable
      FROM sustainability_records
      WHERE id IN (SELECT MAX(id) FROM sustainability_records GROUP BY department_id)
    `).get();

    const risks = getRiskAlerts();
    const predictions = getPredictions('6 Months');
    const recommendations = getRecommendations('All');
    const solarScenario = simulateScenario({ solar_improvement: 100 });

    const reportData = {
      institution: {
        title: 'EcoCampus Decision Engine',
        subtitle: 'Predicting, Comparing and Improving Campus Sustainability through Intelligent Decision Support',
        college: 'Chennai Institute of Technology, Chennai (Autonomous)',
        course: 'PBL Course – JAVA PROGRAMMING',
        generatedAt: new Date().toISOString(),
        overallScore: 87,
        status: 'GREEN CAMPUS',
        benchmarkTarget: 95,
        evaluationPeriod: 'Academic Year 2025–2026'
      },
      departments,
      records,
      averages: {
        electricity: avgStats ? avgStats.avg_electricity : 78,
        water: avgStats ? avgStats.avg_water : 82,
        waste: avgStats ? avgStats.avg_waste : 82,
        transport: avgStats ? avgStats.avg_transport : 80,
        green: avgStats ? avgStats.avg_green : 81,
        renewable: avgStats ? avgStats.avg_renewable : 74
      },
      risks,
      predictions,
      solarScenario,
      recommendations
    };

    return res.status(200).json({
      success: true,
      data: reportData
    });
  } catch (error) {
    console.error('Error in getComprehensiveReport:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate report: ' + error.message
    });
  }
}

export default {
  getComprehensiveReport
};
