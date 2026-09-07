import { getRecommendations } from '../services/recommendationService.js';

export function getAllRecommendations(req, res) {
  try {
    const filter = req.query.priority || req.query.filter || 'All';
    const data = getRecommendations(filter);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getAllRecommendations:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve recommendations: ' + error.message
    });
  }
}

export default {
  getAllRecommendations
};
