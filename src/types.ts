export interface Department {
  id: number;
  name: string;
  score: number;
  status: string;
  rank?: number;
  electricity?: number;
  water?: number;
  wasteRecycling?: number;
  transportation?: number;
  greenCoverage?: number;
  renewableEnergy?: number;
  latestRecordDate?: string;
}

export interface SustainabilityRecord {
  id: number;
  department_id: number;
  department?: string;
  electricity_consumption: number;
  water_usage: number;
  waste_recycling_rate: number;
  transportation_impact: number;
  green_coverage: number;
  renewable_energy_usage: number;
  record_date: string;
}

export interface KPIItem {
  value: number;
  max?: number;
  status?: string;
  unit?: string;
  trend?: string;
  label: string;
}

export interface EnvironmentalIndicator {
  indicator: string;
  benchmark: number;
  campusAverage: number;
  target: number;
}

export interface TrendItem {
  month: string;
  score: number;
  target?: number;
}

export interface RiskAlertItem {
  id: number;
  department_id?: number;
  department_name?: string;
  title: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  created_at: string;
}

export interface RecommendationItem {
  id: number;
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  expected_improvement: string;
  reason: string;
  category: string;
  recommended_action: string;
}

export interface DashboardData {
  overallScore: number;
  status: string;
  kpis: {
    overallScore: KPIItem;
    electricityEfficiency: KPIItem;
    waterEfficiency: KPIItem;
    wasteRecycling: KPIItem;
    renewableEnergy: KPIItem;
    greenCoverage: KPIItem;
  };
  rankedDepartments: Department[];
  mostSustainableDepartment: {
    name: string;
    score: number;
  };
  environmentalIndicators: EnvironmentalIndicator[];
  trendData: TrendItem[];
  departmentIndicators: Array<{
    department: string;
    electricity: number;
    water: number;
    waste: number;
    transportation: number;
    green: number;
    renewable: number;
    score: number;
  }>;
  riskAlerts: RiskAlertItem[];
}

export interface SimulationResult {
  currentScore: number;
  projectedScore: number;
  improvement: number;
  indicatorsBefore: {
    electricity: number;
    water: number;
    wasteRecycling: number;
    transportation: number;
    greenCoverage: number;
    renewableEnergy: number;
  };
  indicatorsAfter: {
    electricity: number;
    water: number;
    wasteRecycling: number;
    transportation: number;
    greenCoverage: number;
    renewableEnergy: number;
  };
  breakdown: Array<{
    factor: string;
    percentage: number;
    pointsAdded: number;
  }>;
  statusBefore: string;
  statusAfter: string;
}

export interface PredictionData {
  currentScore: number;
  predictedScore: number;
  improvement: number;
  timeHorizon: string;
  selectedHorizonDetails: {
    predictedScore: number;
    improvement: number;
    label: string;
    milestones: string[];
  };
  allHorizons: Record<string, {
    predictedScore: number;
    improvement: number;
    label: string;
    milestones: string[];
  }>;
  timelineData: Array<{
    period: string;
    score: number;
    type: 'historical' | 'current' | 'predicted';
  }>;
  modelDescription: string;
  primaryMilestone: string;
}
