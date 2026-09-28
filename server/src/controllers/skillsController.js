const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class SkillsController {
  /**
   * GET /api/skills
   */
  async getSkills(req, res, next) {
    try {
      const { category, search } = req.query;

      const where = { isActive: true };

      if (category) {
        where.category = category;
      }

      if (search) {
        where.name = { contains: search, mode: 'insensitive' };
      }

      const skills = await prisma.skill.findMany({
        where,
        orderBy: { name: 'asc' },
      });

      res.json({
        success: true,
        message: 'Skills retrieved successfully',
        data: { skills, total: skills.length },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/skills/:id
   */
  async getSkillById(req, res, next) {
    try {
      const { id } = req.params;

      const skill = await prisma.skill.findUnique({
        where: { id },
        include: {
          studentSkills: {
            include: {
              student: {
                select: { id: true, name: true, email: true },
              },
            },
          },
          careerSkills: {
            include: {
              career: {
                select: { id: true, title: true },
              },
            },
          },
        },
      });

      if (!skill) {
        return res.status(404).json({
          success: false,
          message: 'Skill not found',
          error: 'NOT_FOUND',
        });
      }

      res.json({
        success: true,
        message: 'Skill retrieved successfully',
        data: { skill },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SkillsController();
