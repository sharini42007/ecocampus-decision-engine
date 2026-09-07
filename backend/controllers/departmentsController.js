import { getDatabase } from '../database/database.js';

export function getAllDepartments(req, res) {
  try {
    const db = getDatabase();
    const departments = db.prepare(`
      SELECT 
        d.id,
        d.name,
        d.score,
        d.status,
        r.electricity_consumption as electricity,
        r.water_usage as water,
        r.waste_recycling_rate as wasteRecycling,
        r.transportation_impact as transportation,
        r.green_coverage as greenCoverage,
        r.renewable_energy_usage as renewableEnergy,
        r.record_date as latestRecordDate
      FROM departments d
      LEFT JOIN sustainability_records r ON r.id = (
        SELECT MAX(id) FROM sustainability_records WHERE department_id = d.id
      )
      ORDER BY d.score DESC, d.id ASC
    `).all();

    return res.status(200).json({
      success: true,
      data: departments
    });
  } catch (error) {
    console.error('Error in getAllDepartments:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve departments: ' + error.message
    });
  }
}

export function getDepartmentById(req, res) {
  try {
    const db = getDatabase();
    const id = req.params.id;

    const department = db.prepare('SELECT * FROM departments WHERE id = ?').get(id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: `Department with ID ${id} not found`
      });
    }

    const latestRecord = db.prepare(`
      SELECT * FROM sustainability_records 
      WHERE department_id = ? 
      ORDER BY record_date DESC, id DESC 
      LIMIT 1
    `).get(id);

    const history = db.prepare(`
      SELECT * FROM sustainability_records 
      WHERE department_id = ? 
      ORDER BY record_date ASC, id ASC
    `).all(id);

    const risks = db.prepare(`
      SELECT * FROM risk_alerts WHERE department_id = ?
    `).all(id);

    return res.status(200).json({
      success: true,
      data: {
        ...department,
        latestRecord: latestRecord || null,
        history,
        risks
      }
    });
  } catch (error) {
    console.error('Error in getDepartmentById:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve department: ' + error.message
    });
  }
}

export default {
  getAllDepartments,
  getDepartmentById
};
