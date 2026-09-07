import { getDatabase } from '../database/database.js';
import { getRiskAlerts } from '../services/riskService.js';

export function getDashboard(req, res) {
  try {
    const db = getDatabase();

    // 1. Fetch departments ranked by score descending
    const departments = db.prepare(`
      SELECT * FROM departments ORDER BY score DESC, id ASC
    `).all();

    const rankedDepartments = departments.map((d, index) => ({
      rank: index + 1,
      id: d.id,
      name: d.name,
      score: d.score,
      status: d.status
    }));

    const mostSustainableDepartment = rankedDepartments[0] || { name: 'ECE', score: 91 };

    // 2. Fetch latest department records for indicator averages
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

    // Overall campus score
    const overallScore = 87;
    const campusStatus = 'GREEN CAMPUS';

    const kpis = {
      overallScore: {
        value: overallScore,
        max: 100,
        status: campusStatus,
        label: 'Overall Sustainability Score'
      },
      electricityEfficiency: {
        value: avgStats ? avgStats.avg_electricity : 78,
        unit: '%',
        trend: '+2.4%',
        label: 'Electricity Efficiency'
      },
      waterEfficiency: {
        value: avgStats ? avgStats.avg_water : 82,
        unit: '%',
        trend: '+1.8%',
        label: 'Water Efficiency'
      },
      wasteRecycling: {
        value: avgStats ? avgStats.avg_waste : 82,
        unit: '%',
        trend: '+4.1%',
        label: 'Waste Recycling'
      },
      renewableEnergy: {
        value: avgStats ? avgStats.avg_renewable : 74,
        unit: '%',
        trend: '+5.0%',
        label: 'Renewable Energy'
      },
      greenCoverage: {
        value: avgStats ? avgStats.avg_green : 81,
        unit: '%',
        trend: '+1.2%',
        label: 'Green Coverage'
      }
    };

    // Environmental indicators chart datasets
    const environmentalIndicators = [
      {
        indicator: 'Electricity',
        benchmark: 85,
        campusAverage: avgStats ? avgStats.avg_electricity : 78,
        target: 95
      },
      {
        indicator: 'Water',
        benchmark: 80,
        campusAverage: avgStats ? avgStats.avg_water : 82,
        target: 90
      },
      {
        indicator: 'Waste Recycling',
        benchmark: 75,
        campusAverage: avgStats ? avgStats.avg_waste : 82,
        target: 92
      },
      {
        indicator: 'Transportation',
        benchmark: 78,
        campusAverage: avgStats ? avgStats.avg_transport : 80,
        target: 88
      },
      {
        indicator: 'Green Coverage',
        benchmark: 80,
        campusAverage: avgStats ? avgStats.avg_green : 81,
        target: 90
      },
      {
        indicator: 'Renewable Energy',
        benchmark: 70,
        campusAverage: avgStats ? avgStats.avg_renewable : 74,
        target: 95
      }
    ];

    // Sustainability Trend (Historical Data: Jan=78, Feb=80, Mar=81, Apr=83, May=85, Jun=87)
    const trendData = [
      { month: 'January', score: 78, target: 80 },
      { month: 'February', score: 80, target: 82 },
      { month: 'March', score: 81, target: 83 },
      { month: 'April', score: 83, target: 85 },
      { month: 'May', score: 85, target: 86 },
      { month: 'June', score: 87, target: 88 }
    ];

    // Department-wise indicator breakdown for multi-department chart
    const deptIndicators = db.prepare(`
      SELECT 
        d.name as department,
        r.electricity_consumption as electricity,
        r.water_usage as water,
        r.waste_recycling_rate as waste,
        r.transportation_impact as transportation,
        r.green_coverage as green,
        r.renewable_energy_usage as renewable,
        d.score
      FROM departments d
      LEFT JOIN sustainability_records r ON r.id = (
        SELECT MAX(id) FROM sustainability_records WHERE department_id = d.id
      )
      ORDER BY d.score DESC
    `).all();

    const riskAlerts = getRiskAlerts();

    return res.status(200).json({
      success: true,
      data: {
        overallScore,
        status: campusStatus,
        kpis,
        rankedDepartments,
        mostSustainableDepartment,
        environmentalIndicators,
        trendData,
        departmentIndicators: deptIndicators,
        riskAlerts
      }
    });
  } catch (error) {
    console.error('Error in getDashboard:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard data: ' + error.message
    });
  }
}

export default {
  getDashboard
};
