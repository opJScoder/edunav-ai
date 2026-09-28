const { z } = require('zod');
const skillGapService = require('../services/skillGapService');

const analyzeSchema = z.object({
  careerId: z.string().uuid('Invalid career ID format'),
});

class SkillGapController {
  /**
   * POST /api/skill-gap/analyze
   */
  async analyze(req, res, next) {
    try {
      const { careerId } = analyzeSchema.parse(req.body);

      const result = await skillGapService.analyze(req.userId, careerId);

      res.json({
        success: true,
        message: 'Skill gap analysis completed',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SkillGapController();
