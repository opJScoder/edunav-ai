const { PrismaClient } = require('@prisma/client');
const { logProgressSchema } = require('../validators/progressValidator');

const prisma = new PrismaClient();

class ProgressController {
  /**
   * GET /api/progress
   */
  async getProgress(req, res, next) {
    try {
      const { limit } = req.query;
      const take = Math.min(parseInt(limit) || 30, 100);

      const progress = await prisma.progressSnapshot.findMany({
        where: { studentId: req.userId },
        orderBy: { date: 'desc' },
        take,
      });

      res.json({
        success: true,
        message: 'Progress retrieved successfully',
        data: { progress, total: progress.length },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/progress/log
   */
  async logProgress(req, res, next) {
    try {
      const data = logProgressSchema.parse(req.body);

      const snapshot = await prisma.progressSnapshot.create({
        data: {
          studentId: req.userId,
          date: data.date ? new Date(data.date) : new Date(),
          studyHours: data.study_hours,
          completedRoadmapItems: data.completed_roadmap_items || 0,
          completedProjects: data.completed_projects || 0,
          readinessPercentage: data.readiness_percentage || 0,
          skillsImproved: data.skills_improved || [],
        },
      });

      res.status(201).json({
        success: true,
        message: 'Progress logged successfully',
        data: { snapshot },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProgressController();
