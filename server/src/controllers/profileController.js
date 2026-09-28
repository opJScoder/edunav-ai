const { PrismaClient } = require('@prisma/client');
const { updateProfileSchema } = require('../validators/profileValidator');

const prisma = new PrismaClient();

class ProfileController {
  /**
   * GET /api/profile
   */
  async getProfile(req, res, next) {
    try {
      const profile = await prisma.studentProfile.findUnique({
        where: { userId: req.userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          careerGoal: {
            select: {
              id: true,
              title: true,
              category: true,
            },
          },
        },
      });

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found',
          error: 'NOT_FOUND',
        });
      }

      res.json({
        success: true,
        message: 'Profile retrieved successfully',
        data: { profile },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/profile
   */
  async updateProfile(req, res, next) {
    try {
      const data = updateProfileSchema.parse(req.body);

      const profile = await prisma.studentProfile.update({
        where: { userId: req.userId },
        data,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          careerGoal: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { profile },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();
