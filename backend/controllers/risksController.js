import { getRiskAlerts, syncRiskAlerts } from '../services/riskService.js';

export function getAllRisks(req, res) {
  try {
    const data = getRiskAlerts();
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getAllRisks:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve risk alerts: ' + error.message
    });
  }
}

export function refreshRisks(req, res) {
  try {
    syncRiskAlerts();
    const data = getRiskAlerts();
    return res.status(200).json({
      success: true,
      data,
      message: 'Risks synchronized successfully.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to sync risks: ' + error.message
    });
  }
}

export default {
  getAllRisks,
  refreshRisks
};
