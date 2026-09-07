import { simulateScenario } from '../services/scenarioService.js';
import { getDatabase } from '../database/database.js';

export function runSimulation(req, res) {
  try {
    const result = simulateScenario(req.body);

    // Save scenario to SQLite history if name provided
    if (req.body.name) {
      const db = getDatabase();
      db.prepare(`
        INSERT INTO scenarios (
          name, solar_improvement, water_improvement, waste_improvement,
          green_coverage_improvement, transportation_improvement, energy_efficiency_improvement,
          projected_score, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        req.body.name,
        req.body.solar_improvement || 0,
        req.body.water_improvement || 0,
        req.body.waste_improvement || 0,
        req.body.green_coverage_improvement || 0,
        req.body.transportation_improvement || 0,
        req.body.energy_efficiency_improvement || 0,
        result.projectedScore,
        new Date().toISOString()
      );
    }

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in runSimulation:', error);
    return res.status(500).json({
      success: false,
      message: 'Scenario simulation failed: ' + error.message
    });
  }
}

export function getSavedScenarios(req, res) {
  try {
    const db = getDatabase();
    const scenarios = db.prepare('SELECT * FROM scenarios ORDER BY id DESC LIMIT 10').all();
    return res.status(200).json({
      success: true,
      data: scenarios
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve saved scenarios: ' + error.message
    });
  }
}

export default {
  runSimulation,
  getSavedScenarios
};
