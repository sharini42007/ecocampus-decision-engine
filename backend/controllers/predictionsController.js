import { getPredictions, savePredictionRecord } from '../services/predictionService.js';

export function getPredictionData(req, res) {
  try {
    const timeHorizon = req.query.horizon || '6 Months';
    const data = getPredictions(timeHorizon);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getPredictionData:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate predictions: ' + error.message
    });
  }
}

export function createPrediction(req, res) {
  try {
    const saved = savePredictionRecord(req.body);
    return res.status(201).json({
      success: true,
      data: saved,
      message: 'Prediction record saved.'
    });
  } catch (error) {
    console.error('Error in createPrediction:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save prediction: ' + error.message
    });
  }
}

export default {
  getPredictionData,
  createPrediction
};
