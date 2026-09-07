import { getDatabase } from './database.js';

export function seedDatabase() {
  const db = getDatabase();

  // Create tables if they do not exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      score INTEGER NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sustainability_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      department_id INTEGER NOT NULL,
      electricity_consumption REAL NOT NULL,
      water_usage REAL NOT NULL,
      waste_recycling_rate REAL NOT NULL,
      transportation_impact REAL NOT NULL,
      green_coverage REAL NOT NULL,
      renewable_energy_usage REAL NOT NULL,
      record_date TEXT NOT NULL,
      FOREIGN KEY (department_id) REFERENCES departments (id)
    );

    CREATE TABLE IF NOT EXISTS predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scenario_name TEXT NOT NULL,
      current_score INTEGER NOT NULL,
      predicted_score INTEGER NOT NULL,
      improvement INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS scenarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      solar_improvement REAL NOT NULL,
      water_improvement REAL NOT NULL,
      waste_improvement REAL NOT NULL,
      green_coverage_improvement REAL NOT NULL,
      transportation_improvement REAL NOT NULL,
      energy_efficiency_improvement REAL NOT NULL,
      projected_score INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS recommendations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      priority TEXT NOT NULL,
      expected_improvement TEXT NOT NULL,
      reason TEXT NOT NULL,
      category TEXT NOT NULL,
      recommended_action TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS risk_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      department_id INTEGER,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      severity TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (department_id) REFERENCES departments (id)
    );
  `);

  // Check if departments already seeded
  const deptCountRow = db.prepare('SELECT COUNT(*) as count FROM departments').get();
  const count = deptCountRow ? deptCountRow.count : 0;

  if (count === 0) {
    console.log('[Seed] Seeding initial prototype sample data into SQLite...');

    // Seed Departments: ECE = 91, IT = 88, CSE = 85, MECH = 72
    const insertDept = db.prepare('INSERT INTO departments (name, score, status) VALUES (?, ?, ?)');
    insertDept.run('ECE', 91, 'Excellent');
    insertDept.run('IT', 88, 'Excellent');
    insertDept.run('CSE', 85, 'Good');
    insertDept.run('MECH', 72, 'Needs Improvement');

    const depts = db.prepare('SELECT id, name FROM departments').all();
    const deptMap = {};
    depts.forEach(d => { deptMap[d.name] = d.id; });

    // Seed Sample Environmental Records
    const insertRecord = db.prepare(`
      INSERT INTO sustainability_records (
        department_id, electricity_consumption, water_usage, waste_recycling_rate,
        transportation_impact, green_coverage, renewable_energy_usage, record_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Sample prototype records
    // ECE: Electricity=72, Water=78, Waste Recycling=92, Transportation=86, Green Coverage=90, Renewable Energy=85
    insertRecord.run(deptMap['ECE'], 72, 78, 92, 86, 90, 85, '2026-06-01');
    // IT: Electricity=76, Water=82, Waste Recycling=88, Transportation=84, Green Coverage=86, Renewable Energy=80
    insertRecord.run(deptMap['IT'], 76, 82, 88, 84, 86, 80, '2026-06-01');
    // CSE: Electricity=80, Water=79, Waste Recycling=84, Transportation=80, Green Coverage=82, Renewable Energy=77
    insertRecord.run(deptMap['CSE'], 80, 79, 84, 80, 82, 77, '2026-06-01');
    // MECH: Electricity=92, Water=88, Waste Recycling=65, Transportation=70, Green Coverage=68, Renewable Energy=55
    insertRecord.run(deptMap['MECH'], 92, 88, 65, 70, 68, 55, '2026-06-01');

    // Seed Predictions: Current Campus = 87, After Solar Installation = 94 (+7)
    const insertPred = db.prepare(`
      INSERT INTO predictions (scenario_name, current_score, predicted_score, improvement, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    insertPred.run('Solar Array Installation (250 kW)', 87, 94, 7, new Date().toISOString());
    insertPred.run('Smart Campus HVAC Retrofit', 87, 90, 3, new Date().toISOString());
    insertPred.run('Zero-Waste Circular Campus Phase 1', 87, 91, 4, new Date().toISOString());

    // Seed Scenarios
    const insertScenario = db.prepare(`
      INSERT INTO scenarios (
        name, solar_improvement, water_improvement, waste_improvement,
        green_coverage_improvement, transportation_improvement, energy_efficiency_improvement,
        projected_score, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertScenario.run('Full Solar Canopy Deployment', 100, 0, 0, 0, 0, 0, 94, new Date().toISOString());
    insertScenario.run('Integrated Eco-Campus Blitz', 60, 40, 50, 30, 35, 45, 96, new Date().toISOString());

    // Seed Recommendations
    const insertRec = db.prepare(`
      INSERT INTO recommendations (
        title, description, priority, expected_improvement, reason, category, recommended_action
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insertRec.run(
      'Solar Panel Installation',
      'Deploy 250 kW rooftop solar photovoltaic arrays across the Academic Blocks and Engineering Workshop roofs.',
      'HIGH',
      '+7',
      'High electricity consumption and low renewable energy contribution in mechanical and laboratory complexes.',
      'Renewable Energy',
      'Issue tender for solar installation on Block A and Mechanical workshops.'
    );
    insertRec.run(
      'Water Conservation System',
      'Install automated greywater filtration, low-flow fixtures, and expand the campus rainwater harvesting recharge well network.',
      'MEDIUM',
      '+2',
      'Water usage across labs and student residences exceeds optimal efficiency targets by 18%.',
      'Water',
      'Retrofit sensor-based taps and connect lab runoff to central bio-swales.'
    );
    insertRec.run(
      'Waste Recycling Program',
      'Implement campus-wide automated sorting kiosks, workshop scrap segregation, and a decentralized organic composting unit.',
      'HIGH',
      '+3',
      'Mechanical and fabrication workshops report only 65% waste recycling compliance, falling short of green campus certification.',
      'Waste Recycling',
      'Establish segregated collection stations and partner with certified e-waste recyclers.'
    );
    insertRec.run(
      'Smart Energy Monitoring',
      'Deploy IoT smart sub-meters and automated ambient lighting controls across lecture halls and computer laboratories.',
      'MEDIUM',
      '+2',
      'Baseload energy during off-hours remains unnecessarily high in IT and CSE computational centers.',
      'Energy Efficiency',
      'Integrate automated occupancy sensors and smart lab timers.'
    );
    insertRec.run(
      'Green Campus Expansion',
      'Expand perimeter native tree canopies, student garden courtyards, and vertical micro-forests along the academic corridor.',
      'LOW',
      '+2',
      'Perimeter green coverage currently at 68% in the southern sector of campus.',
      'Greenery',
      'Plant 300 indigenous saplings during the annual campus plantation drive.'
    );

    // Seed Risk Alerts
    const insertRisk = db.prepare(`
      INSERT INTO risk_alerts (department_id, title, description, severity, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    insertRisk.run(
      deptMap['MECH'],
      'High Electricity Consumption',
      'Heavy workshop machinery and foundry testing rigs exceed scheduled energy quota by 22% during peak lab hours.',
      'HIGH',
      new Date().toISOString()
    );
    insertRisk.run(
      deptMap['MECH'],
      'Low Waste Recycling Compliance',
      'Workshop scrap recycling index measured at 65%, breaching the institutional benchmark of 75%.',
      'HIGH',
      new Date().toISOString()
    );
    insertRisk.run(
      deptMap['MECH'],
      'Low Renewable Energy Adoption',
      'Renewable energy contribution in mechanical division is 55%, the lowest across all engineering wings.',
      'MEDIUM',
      new Date().toISOString()
    );
    insertRisk.run(
      deptMap['CSE'],
      'Server Lab Cooling Load Alert',
      'Continuous cooling requirements in AI and cloud servers slightly elevate night-time baseline energy draw.',
      'LOW',
      new Date().toISOString()
    );

    console.log('[Seed] Database seeding completed successfully.');
  }
}

export default seedDatabase;
