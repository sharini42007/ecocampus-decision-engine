import { getDatabase } from '../database/database.js';

export function getRiskAlerts() {
  const db = getDatabase();
  const alerts = db.prepare(`
    SELECT r.*, d.name as department_name 
    FROM risk_alerts r
    LEFT JOIN departments d ON r.department_id = d.id
    ORDER BY 
      CASE r.severity 
        WHEN 'HIGH' THEN 1 
        WHEN 'MEDIUM' THEN 2 
        WHEN 'LOW' THEN 3 
        ELSE 4 
      END,
      r.id DESC
  `).all();
  return alerts;
}

export function syncRiskAlerts() {
  const db = getDatabase();
  const records = db.prepare(`
    SELECT r.*, d.name as department_name 
    FROM sustainability_records r
    JOIN departments d ON r.department_id = d.id
    WHERE r.id IN (
      SELECT MAX(id) FROM sustainability_records GROUP BY department_id
    )
  `).all();

  // Clear existing auto alerts
  db.exec('DELETE FROM risk_alerts');

  const insertRisk = db.prepare(`
    INSERT INTO risk_alerts (department_id, title, description, severity, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const rec of records) {
    // 1. Electricity consumption risk
    if (rec.electricity_consumption > 88) {
      insertRisk.run(
        rec.department_id,
        'High Electricity Consumption',
        `${rec.department_name} machinery & equipment load is elevated at ${rec.electricity_consumption} kWh metric (Threshold: < 80).`,
        'HIGH',
        new Date().toISOString()
      );
    } else if (rec.electricity_consumption > 82) {
      insertRisk.run(
        rec.department_id,
        'Moderate Electricity Draw',
        `${rec.department_name} energy consumption slightly elevated at ${rec.electricity_consumption}.`,
        'MEDIUM',
        new Date().toISOString()
      );
    }

    // 2. Low Waste Recycling
    if (rec.waste_recycling_rate < 70) {
      insertRisk.run(
        rec.department_id,
        'Low Waste Recycling Compliance',
        `${rec.department_name} recycling rate is at ${rec.waste_recycling_rate}%, falling below the institutional minimum benchmark of 75%.`,
        'HIGH',
        new Date().toISOString()
      );
    } else if (rec.waste_recycling_rate < 80) {
      insertRisk.run(
        rec.department_id,
        'Sub-Optimal Recycling Efficiency',
        `${rec.department_name} waste sorting compliance currently at ${rec.waste_recycling_rate}%.`,
        'MEDIUM',
        new Date().toISOString()
      );
    }

    // 3. Low Renewable Energy Adoption
    if (rec.renewable_energy_usage < 60) {
      insertRisk.run(
        rec.department_id,
        'Low Renewable Energy Adoption',
        `${rec.department_name} draws only ${rec.renewable_energy_usage}% power from renewable / solar sources.`,
        'HIGH',
        new Date().toISOString()
      );
    } else if (rec.renewable_energy_usage < 75) {
      insertRisk.run(
        rec.department_id,
        'Renewable Grid Transition Lag',
        `${rec.department_name} clean energy ratio is ${rec.renewable_energy_usage}%. Expansion required.`,
        'MEDIUM',
        new Date().toISOString()
      );
    }

    // 4. High Water Usage
    if (rec.water_usage > 85) {
      insertRisk.run(
        rec.department_id,
        'High Water Usage Alert',
        `${rec.department_name} laboratory & washroom water usage rate is at ${rec.water_usage} index.`,
        'MEDIUM',
        new Date().toISOString()
      );
    }

    // 5. Low Green Coverage
    if (rec.green_coverage < 70) {
      insertRisk.run(
        rec.department_id,
        'Low Green Canopy Coverage',
        `Perimeter around ${rec.department_name} wing has green canopy coverage of ${rec.green_coverage}%.`,
        'LOW',
        new Date().toISOString()
      );
    }
  }
}

export default {
  getRiskAlerts,
  syncRiskAlerts
};
