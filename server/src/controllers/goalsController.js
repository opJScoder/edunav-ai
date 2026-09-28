const { PrismaClient } = require('@prisma/client');
const { createGoalSchema, updateGoalSchema } = require('../validators/goalsValidator');

const prisma = new PrismaClient();

class GoalsController {
  /**
   * GET /api/goals
   */
  async getGoals(req, res, next) {
    try {
      const { status, semester } = req.query;

      const where = { studentId: req.userId };

      if (status) {
        where.status = status;
      }

      if (semester) {
        where.semester = parseInt(semester);
      }

      const goals = await prisma.semesterGoal.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        message: 'Goals retrieved successfully',
        data: { goals, total: goals.length },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/goals
   */
  async createGoal(req, res, next) {
    try {
      const data = createGoalSchema.parse(req.body);

      const goal = await prisma.semesterGoal.create({
        data: {
          studentId: req.userId,
          title: data.title,
          description: data.description,
          semester: data.semester,
          targetDate: new Date(data.target_date),
          progressPercentage: data.progress_percentage || 0,
          status: data.status || 'not_started',
        },
      });

      res.status(201).json({
        success: true,
        message: 'Goal created successfully',
        data: { goal },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/goals/:goalId
   */
  async updateGoal(req, res, next) {
    try {
      const { goalId } = req.params;
      const data = updateGoalSchema.parse(req.body);

      // Verify ownership
      const existing = await prisma.semesterGoal.findFirst({
        where: { id: goalId, studentId: req.userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Goal not found',
          error: 'NOT_FOUND',
        });
      }

      const updateData = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.semester !== undefined) updateData.semester = data.semester;
      if (data.target_date !== undefined) updateData.targetDate = new Date(data.target_date);
      if (data.progress_percentage !== undefined) updateData.progressPercentage = data.progress_percentage;
      if (data.status !== undefined) updateData.status = data.status;

      const goal = await prisma.semesterGoal.update({
        where: { id: goalId },
        data: updateData,
      });

      res.json({
        success: true,
        message: 'Goal updated successfully',
        data: { goal },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/goals/:goalId
   */
  async deleteGoal(req, res, next) {
    try {
      const { goalId } = req.params;

      // Verify ownership
      const existing = await prisma.semesterGoal.findFirst({
        where: { id: goalId, studentId: req.userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Goal not found',
          error: 'NOT_FOUND',
        });
      }

      await prisma.semesterGoal.delete({
        where: { id: goalId },
      });

      res.json({
        success: true,
        message: 'Goal deleted successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GoalsController();
