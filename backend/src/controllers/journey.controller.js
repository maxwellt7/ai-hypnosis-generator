import { journeyService } from '../services/journey.service.js';
import { asyncHandler } from '../middleware/error.middleware.js';

export class JourneyController {
  create = asyncHandler(async (req, res) => {
    const journeyData = req.body;
    const journey = await journeyService.createJourney(req.userId, journeyData);

    res.status(201).json({
      success: true,
      data: { journey },
      message: 'Journey creation started. This may take 5-10 minutes.',
    });
  });

  get = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const journey = await journeyService.getJourney(id, req.userId);

    res.json({
      success: true,
      data: { journey },
    });
  });

  list = asyncHandler(async (req, res) => {
    const { status, limit } = req.query;
    const options = {
      status,
      limit: limit ? parseInt(limit) : undefined,
    };

    const journeys = await journeyService.listJourneys(req.userId, options);

    res.json({
      success: true,
      data: { journeys },
      count: journeys.length,
    });
  });

  getDays = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const journey = await journeyService.getJourney(id, req.userId);

    res.json({
      success: true,
      data: {
        days: journey.journey_days || [],
      },
    });
  });

  getDay = asyncHandler(async (req, res) => {
    const { id, dayNumber } = req.params;
    const day = await journeyService.getJourneyDay(id, parseInt(dayNumber), req.userId);

    res.json({
      success: true,
      data: { day },
    });
  });

  markDayComplete = asyncHandler(async (req, res) => {
    const { id, dayNumber } = req.params;
    const day = await journeyService.markDayComplete(id, parseInt(dayNumber), req.userId);

    res.json({
      success: true,
      data: { day },
      message: 'Day marked as complete!',
    });
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await journeyService.deleteJourney(id, req.userId);

    res.json({
      success: true,
      message: 'Journey deleted successfully',
    });
  });
}

export const journeyController = new JourneyController();
export default journeyController;

