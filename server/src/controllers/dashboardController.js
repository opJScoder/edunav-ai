const { PrismaClient } = require('@prisma/client');
const skillGapService = require('../services/skillGapService');
const recommendationService = require('../services/recommendationService');

const prisma = new PrismaClient();

class DashboardController {
  /**
   * GET /api/dashboard
   */
  async getDashboard(req, res, next) {
    try {
      // Get student profile with career goal
      const profile = await prisma.studentProfile.findUnique({
        where: { userId: req.userId },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          careerGoal: {
            select: { id: true, title: true, category: true },
          },
        },
      });

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Student profile not found',
          error: 'NOT_FOUND',
        });
      }

      // Get student skills
      const studentSkills = await prisma.studentSkill.findMany({
        where: { studentId: req.userId },
        include: {
          skill: {
            select: { id: true, name: true, category: true },
          },
        },
      });

      // Get roadmaps with progress
      const roadmaps = await prisma.roadmap.findMany({
        where: { studentId: req.userId },
        include: {
          career: {
            select: { id: true, title: true },
          },
          roadmapItems: {
            select: {
              id: true,
              status: true,
              progressPercentage: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Calculate roadmap progress
      let totalItems = 0;
      let completedItems = 0;
      let roadmapProgress = 0;

      for (const roadmap of roadmaps) {
        totalItems += roadmap.roadmapItems.length;
        completedItems += roadmap.roadmapItems.filter(
          (item) => item.status === 'completed'
        ).length;
      }

      if (totalItems > 0) {
        roadmapProgress = Math.round((completedItems / totalItems) * 100);
      }

      // Get skill gap analysis if career goal exists
      let readiness = 0;
      if (profile.careerGoalId) {
        try {
          const gapAnalysis = await skillGapService.analyze(req.userId, profile.careerGoalId);
          readiness = gapAnalysis.readiness;
        } catch (error) {
          console.warn('Could not calculate readiness:', error.message);
        }
      }

      // Get study hours this week (from progress snapshots)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const recentSnapshots = await prisma.progressSnapshot.findMany({
        where: {
          studentId: req.userId,
          date: { gte: oneWeekAgo },
        },
        orderBy: { date: 'asc' },
      });

      const studyHoursThisWeek = recentSnapshots.reduce(
        (sum, snap) => sum + parseFloat(snap.studyHours),
        0
      );

      // Get goals
      const goals = await prisma.semesterGoal.findMany({
        where: { studentId: req.userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      // Get recommended projects
      const recommendedProjects = await recommendationService.getRecommendations(req.userId);

      // Get recent progress snapshots
      const recentProgress = await prisma.progressSnapshot.findMany({
        where: { studentId: req.userId },
        orderBy: { date: 'desc' },
        take: 7,
      });

      // Calculate skills completed (level >= 3)
      const skillsCompleted = studentSkills.filter((ss) => ss.level >= 3).length;

      res.json({
        success: true,
        message: 'Dashboard data retrieved successfully',
        data: {
          student: {
            id: profile.user.id,
            name: profile.user.name,
            email: profile.user.email,
            branch: profile.branch,
            semester: profile.semester,
            college: profile.college,
            studyHoursPerWeek: profile.studyHoursPerWeek,
          },
          career: profile.careerGoal || null,
          readiness,
          roadmapProgress,
          studyHoursThisWeek: parseFloat(studyHoursThisWeek.toFixed(1)),
          completedProjects: recentSnapshots.reduce(
            (sum, snap) => sum + snap.completedProjects,
            0
          ),
          skillsCompleted,
          totalSkills: studentSkills.length,
          goals,
          recentProgress,
          recommendedProjects: recommendedProjects.slice(0, 5),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
