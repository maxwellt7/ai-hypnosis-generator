import { statsService } from '../services/stats.service.js';
import { asyncHandler } from '../middleware/error.middleware.js';

export class StatsController {
  getStats = asyncHandler(async (req, res) => {
    const stats = await statsService.getUserStats(req.userId);

    res.json({
      success: true,
      data: { stats },
    });
  });

  getStreaks = asyncHandler(async (req, res) => {
    const streakInfo = await statsService.getStreakInfo(req.userId);

    res.json({
      success: true,
      data: streakInfo,
    });
  });

  getHistory = asyncHandler(async (req, res) => {
    const { days } = req.query;
    const daysInt = days ? parseInt(days) : 30;

    const history = await statsService.getListeningHistory(req.userId, daysInt);

    res.json({
      success: true,
      data: { history },
    });
  });

  getJourneyStats = asyncHandler(async (req, res) => {
    const journeyStats = await statsService.getJourneyStats(req.userId);

    res.json({
      success: true,
      data: journeyStats,
    });
  });

  getTimeDistribution = asyncHandler(async (req, res) => {
    const { days } = req.query;
    const daysInt = days ? parseInt(days) : 30;

    const distribution = await statsService.getTimeOfDayDistribution(req.userId, daysInt);

    res.json({
      success: true,
      data: { distribution },
    });
  });
}

export const statsController = new StatsController();
export default statsController;

