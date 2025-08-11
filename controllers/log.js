// controllers/logController.js
import Log from '../models/log.js';

export const getLogs = async (req, res) => {
  try {
    const { userId, limit = 50, page = 1,date } = req.query;

    const filter = {};
    if (userId) filter.userId = userId;
    // if (date) filter.timestamp = date

    // Add date range filter
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1); // next day
      filter.timestamp = { $gte: start, $lt: end };
    }

    const logs = await Log.find(filter)
      .populate({path: 'userId', model: 'users'})
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Log.countDocuments(filter);

    res.status(200).json({
      success: true,
      result: logs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};
