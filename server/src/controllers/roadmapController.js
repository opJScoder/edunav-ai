const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const skillGapService = require('../services/skillGapService');
const aiService = require('../services/aiService');

const prisma = new PrismaClient();

const generateSchema = z.object({
  careerId: z.string().uuid('Invalid career ID format'),
});

const updateItemSchema = z.object({
  status: z.enum(['not_started', 'in_progress', 'completed']).optional(),
  progress_percentage: z.number().int().min(0).max(100).optional(),
});

class RoadmapController {
  /**
   * POST /api/roadmap/generate
   */
  async generate(req, res, next) {
    try {
      const { careerId } = generateSchema.parse(req.body);

      // Get skill gap analysis
      const skillGapData = await skillGapService.analyze(req.userId, careerId);

      // Generate roadmap using AI (or fallback)
      const roadmapData = await aiService.generateRoadmap(skillGapData);

      // Create roadmap in database
      const roadmap = await prisma.roadmap.create({
        data: {
          studentId: req.userId,
          careerId,
          title: roadmapData.title,
          description: roadmapData.description,
          readinessAtCreation: skillGapData.readiness,
          estimatedTotalHours: roadmapData.estimatedTotalHours,
          status: 'not_started',
          roadmapItems: {
            create: roadmapData.items.map((item, index) => ({
              title: item.title,
              description: item.description,
              stepOrder: index + 1,
              estimatedHours: item.estimatedHours,
              difficulty: item.difficulty,
              resources: item.resources,
              status: 'not_started',
              progressPercentage: 0,
            })),
          },
        },
        include: {
          roadmapItems: {
            orderBy: { stepOrder: 'asc' },
          },
          career: {
            select: { id: true, title: true },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Roadmap generated successfully',
        data: { roadmap },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/roadmap
   */
  async getRoadmaps(req, res, next) {
    try {
      const roadmaps = await prisma.roadmap.findMany({
        where: { studentId: req.userId },
        include: {
          career: {
            select: { id: true, title: true, category: true },
          },
          roadmapItems: {
            select: {
              id: true,
              title: true,
              status: true,
              progressPercentage: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        message: 'Roadmaps retrieved successfully',
        data: { roadmaps, total: roadmaps.length },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/roadmap/:roadmapId
   */
  async getRoadmapById(req, res, next) {
    try {
      const { roadmapId } = req.params;

      const roadmap = await prisma.roadmap.findFirst({
        where: {
          id: roadmapId,
          studentId: req.userId,
        },
        include: {
          career: {
            select: { id: true, title: true, description: true, category: true },
          },
          roadmapItems: {
            include: {
              skill: {
                select: { id: true, name: true, category: true },
              },
            },
            orderBy: { stepOrder: 'asc' },
          },
        },
      });

      if (!roadmap) {
        return res.status(404).json({
          success: false,
          message: 'Roadmap not found',
          error: 'NOT_FOUND',
        });
      }

      res.json({
        success: true,
        message: 'Roadmap retrieved successfully',
        data: { roadmap },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/roadmap/item/:itemId
   */
  async updateRoadmapItem(req, res, next) {
    try {
      const { itemId } = req.params;
      const data = updateItemSchema.parse(req.body);

      // Verify the item belongs to a roadmap owned by the user
      const item = await prisma.roadmapItem.findFirst({
        where: {
          id: itemId,
          roadmap: { studentId: req.userId },
        },
      });

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Roadmap item not found',
          error: 'NOT_FOUND',
        });
      }

      // If status is completed, set completedAt
      const updateData = { ...data };
      if (data.status === 'completed' && item.status !== 'completed') {
        updateData.completedAt = new Date();
      } else if (data.status && data.status !== 'completed') {
        updateData.completedAt = null;
      }

      const updatedItem = await prisma.roadmapItem.update({
        where: { id: itemId },
        data: updateData,
        include: {
          skill: {
            select: { id: true, name: true },
          },
        },
      });

      res.json({
        success: true,
        message: 'Roadmap item updated successfully',
        data: { item: updatedItem },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RoadmapController();
