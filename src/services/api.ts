import axios from 'axios';
import type {
  DashboardData,
  Department,
  SustainabilityRecord,
  PredictionData,
  SimulationResult,
  RecommendationItem,
  RiskAlertItem
} from '../types';

// Use relative /api in browser (which seamlessly routes to Express backend on port 3000 or proxy),
// or fall back to VITE_API_URL if configured for standalone multi-port setup.
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response unwrap helper
const handleResponse = (response: any) => {
  if (response.data && response.data.success !== undefined) {
    return response.data.data;
  }
  return response.data;
};

// 1. Dashboard
export async function getDashboard(): Promise<DashboardData> {
  const res = await apiClient.get('/dashboard');
  return handleResponse(res);
}

// 2. Departments
export async function getDepartments(): Promise<Department[]> {
  const res = await apiClient.get('/departments');
  return handleResponse(res);
}

export async function getDepartment(id: number | string): Promise<any> {
  const res = await apiClient.get(`/departments/${id}`);
  return handleResponse(res);
}

// 3. Sustainability Data CRUD
export async function getSustainabilityData(): Promise<SustainabilityRecord[]> {
  const res = await apiClient.get('/sustainability');
  return handleResponse(res);
}

export async function addSustainabilityData(data: Partial<SustainabilityRecord>): Promise<any> {
  const res = await apiClient.post('/sustainability', data);
  return handleResponse(res);
}

export async function updateSustainabilityData(id: number | string, data: Partial<SustainabilityRecord>): Promise<any> {
  const res = await apiClient.put(`/sustainability/${id}`, data);
  return handleResponse(res);
}

export async function deleteSustainabilityData(id: number | string): Promise<any> {
  const res = await apiClient.delete(`/sustainability/${id}`);
  return handleResponse(res);
}

// 4. Predictions
export async function getPredictions(horizon: string = '6 Months'): Promise<PredictionData> {
  const res = await apiClient.get('/predictions', { params: { horizon } });
  return handleResponse(res);
}

export async function createPrediction(data: any): Promise<any> {
  const res = await apiClient.post('/predictions', data);
  return handleResponse(res);
}

// 5. Scenario Simulation
export async function simulateScenario(data: {
  solar_improvement?: number;
  water_improvement?: number;
  waste_improvement?: number;
  green_coverage_improvement?: number;
  transportation_improvement?: number;
  energy_efficiency_improvement?: number;
  name?: string;
}): Promise<SimulationResult> {
  const res = await apiClient.post('/scenarios/simulate', data);
  return handleResponse(res);
}

// 6. Recommendations
export async function getRecommendations(filter: string = 'All'): Promise<RecommendationItem[]> {
  const res = await apiClient.get('/recommendations', { params: { filter } });
  return handleResponse(res);
}

// 7. Risk Alerts
export async function getRisks(): Promise<RiskAlertItem[]> {
  const res = await apiClient.get('/risks');
  return handleResponse(res);
}

// 8. Comprehensive Reports
export async function getReports(): Promise<any> {
  const res = await apiClient.get('/reports');
  return handleResponse(res);
}

export default {
  getDashboard,
  getDepartments,
  getDepartment,
  getSustainabilityData,
  addSustainabilityData,
  updateSustainabilityData,
  deleteSustainabilityData,
  getPredictions,
  createPrediction,
  simulateScenario,
  getRecommendations,
  getRisks,
  getReports,
};
