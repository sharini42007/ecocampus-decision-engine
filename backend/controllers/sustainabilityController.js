import { getDatabase } from '../database/database.js';
import { calculateScore, getDepartmentRankStatus, syncAllScores } from '../services/scoringService.js';

export function getAllSustainabilityRecords(req, res) {
  try {
    const db = getDatabase();
    const records = db.prepare(`
      SELECT 
        r.id,
        r.department_id,
        d.name as department,
        r.electricity_consumption,
        r.water_usage,
        r.waste_recycling_rate,
        r.transportation_impact,
        r.green_coverage,
        r.renewable_energy_usage,
        r.record_date
      FROM sustainability_records r
      JOIN departments d ON r.department_id = d.id
      ORDER BY r.record_date DESC, r.id DESC
    `).all();

    return res.status(200).json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error('Error in getAllSustainabilityRecords:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve sustainability records: ' + error.message
    });
  }
}

export function createSustainabilityRecord(req, res) {
  try {
    const db = getDatabase();
    const {
      department_id,
      electricity_consumption,
      water_usage,
      waste_recycling_rate,
      transportation_impact,
      green_coverage,
      renewable_energy_usage,
      record_date
    } = req.body;

    // Validation
    if (!department_id) {
      return res.status(400).json({ success: false, message: 'Department is required' });
    }

    const dept = db.prepare('SELECT * FROM departments WHERE id = ?').get(department_id);
    if (!dept) {
      return res.status(400).json({ success: false, message: 'Invalid department ID' });
    }

    const e = parseFloat(electricity_consumption);
    const w = parseFloat(water_usage);
    const wr = parseFloat(waste_recycling_rate);
    const t = parseFloat(transportation_impact);
    const g = parseFloat(green_coverage);
    const re = parseFloat(renewable_energy_usage);

    if ([e, w, wr, t, g, re].some(val => isNaN(val) || val < 0 || val > 100)) {
      return res.status(400).json({
        success: false,
        message: 'All environmental indicators must be valid numbers between 0 and 100'
      });
    }

    const dateVal = record_date || new Date().toISOString().split('T')[0];

    // Insert record
    const insertStmt = db.prepare(`
      INSERT INTO sustainability_records (
        department_id, electricity_consumption, water_usage, waste_recycling_rate,
        transportation_impact, green_coverage, renewable_energy_usage, record_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(department_id, e, w, wr, t, g, re, dateVal);

    // Recalculate score for department
    const { score } = calculateScore({
      electricity: e,
      water: w,
      wasteRecycling: wr,
      transportation: t,
      greenCoverage: g,
      renewableEnergy: re
    });

    const status = getDepartmentRankStatus(score);
    db.prepare('UPDATE departments SET score = ?, status = ? WHERE id = ?').run(score, status, department_id);

    // Sync all scores and risk alerts
    syncAllScores();

    return res.status(201).json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        department_id,
        department: dept.name,
        electricity_consumption: e,
        water_usage: w,
        waste_recycling_rate: wr,
        transportation_impact: t,
        green_coverage: g,
        renewable_energy_usage: re,
        record_date: dateVal,
        calculatedScore: score,
        status
      },
      message: `Record added successfully. Updated ${dept.name} score to ${score}.`
    });
  } catch (error) {
    console.error('Error in createSustainabilityRecord:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create sustainability record: ' + error.message
    });
  }
}

export function updateSustainabilityRecord(req, res) {
  try {
    const db = getDatabase();
    const id = req.params.id;
    const {
      department_id,
      electricity_consumption,
      water_usage,
      waste_recycling_rate,
      transportation_impact,
      green_coverage,
      renewable_energy_usage,
      record_date
    } = req.body;

    const existing = db.prepare('SELECT * FROM sustainability_records WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: `Record with ID ${id} not found` });
    }

    const deptId = department_id || existing.department_id;
    const e = electricity_consumption !== undefined ? parseFloat(electricity_consumption) : existing.electricity_consumption;
    const w = water_usage !== undefined ? parseFloat(water_usage) : existing.water_usage;
    const wr = waste_recycling_rate !== undefined ? parseFloat(waste_recycling_rate) : existing.waste_recycling_rate;
    const t = transportation_impact !== undefined ? parseFloat(transportation_impact) : existing.transportation_impact;
    const g = green_coverage !== undefined ? parseFloat(green_coverage) : existing.green_coverage;
    const re = renewable_energy_usage !== undefined ? parseFloat(renewable_energy_usage) : existing.renewable_energy_usage;
    const d = record_date || existing.record_date;

    db.prepare(`
      UPDATE sustainability_records SET
        department_id = ?,
        electricity_consumption = ?,
        water_usage = ?,
        waste_recycling_rate = ?,
        transportation_impact = ?,
        green_coverage = ?,
        renewable_energy_usage = ?,
        record_date = ?
      WHERE id = ?
    `).run(deptId, e, w, wr, t, g, re, d, id);

    // Recalculate score for department
    const { score } = calculateScore({
      electricity: e,
      water: w,
      wasteRecycling: wr,
      transportation: t,
      greenCoverage: g,
      renewableEnergy: re
    });

    const status = getDepartmentRankStatus(score);
    db.prepare('UPDATE departments SET score = ?, status = ? WHERE id = ?').run(score, status, deptId);

    syncAllScores();

    return res.status(200).json({
      success: true,
      data: { id, department_id: deptId, score, status },
      message: 'Record updated successfully.'
    });
  } catch (error) {
    console.error('Error in updateSustainabilityRecord:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update sustainability record: ' + error.message
    });
  }
}

export function deleteSustainabilityRecord(req, res) {
  try {
    const db = getDatabase();
    const id = req.params.id;

    const existing = db.prepare('SELECT * FROM sustainability_records WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: `Record with ID ${id} not found` });
    }

    db.prepare('DELETE FROM sustainability_records WHERE id = ?').run(id);

    // Re-sync scores
    syncAllScores();

    return res.status(200).json({
      success: true,
      message: `Sustainability record #${id} deleted successfully.`
    });
  } catch (error) {
    console.error('Error in deleteSustainabilityRecord:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete sustainability record: ' + error.message
    });
  }
}

export default {
  getAllSustainabilityRecords,
  createSustainabilityRecord,
  updateSustainabilityRecord,
  deleteSustainabilityRecord
};
