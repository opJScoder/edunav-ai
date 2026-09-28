const { PrismaClient } = require('@prisma/client');
const recommendationService = require('../services/recommendationService');

const prisma = new PrismaClient();

class ProjectsController {
  /**
   * GET /api/projects
   */
  async getProjects(req, res, next) {
    try {
      const { difficulty, search } = req.query;

      const where = {};

      if (difficulty) {
        where.difficulty = difficulty;
      }

      if (search) {
        where.title = { contains: search, mode: 'insensitive' };
      }

      const projects = await prisma.project.findMany({
        where,
        include: {
          projectSkills: {
            include: {
              skill: {
                select: { id: true, name: true, category: true },
              },
            },
          },
        },
        orderBy: { title: 'asc' },
      });

      res.json({
        success: true,
        message: 'Projects retrieved successfully',
        data: { projects, total: projects.length },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/projects/recommended
   */
  async getRecommended(req, res, next) {
    try {
      const recommendations = await recommendationService.getRecommendations(req.userId);

      res.json({
        success: true,
        message: 'Recommended projects retrieved successfully',
        data: { recommendations, total: recommendations.length },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProjectsController();
