const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CareersController {
  /**
   * GET /api/careers
   */
  async getCareers(req, res, next) {
    try {
      const { category } = req.query;

      const where = { isActive: true };
      if (category) {
        where.category = category;
      }

      const careers = await prisma.career.findMany({
        where,
        include: {
          careerSkills: {
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
        message: 'Careers retrieved successfully',
        data: { careers, total: careers.length },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/careers/:careerId
   */
  async getCareerById(req, res, next) {
    try {
      const { careerId } = req.params;

      const career = await prisma.career.findUnique({
        where: { id: careerId },
        include: {
          careerSkills: {
            include: {
              skill: {
                select: { id: true, name: true, category: true, description: true },
              },
            },
            orderBy: { weight: 'desc' },
          },
        },
      });

      if (!career) {
        return res.status(404).json({
          success: false,
          message: 'Career not found',
          error: 'NOT_FOUND',
        });
      }

      res.json({
        success: true,
        message: 'Career retrieved successfully',
        data: { career },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CareersController();
