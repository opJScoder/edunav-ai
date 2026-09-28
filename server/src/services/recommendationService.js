const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Project Recommendation Engine
 * Recommends projects based on student's missing skills
 */
class RecommendationService {
  /**
   * Get personalized project recommendations for a student
   * @param {string} studentId - UUID of the student
   * @returns {Array} Recommended projects with match details
   */
  async getRecommendations(studentId) {
    // Get student's skills
    const studentSkills = await prisma.studentSkill.findMany({
      where: { studentId },
      include: { skill: true },
    });

    const studentSkillIds = new Set(studentSkills.map((ss) => ss.skillId));

    // Get student's profile to find career goal
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: studentId },
    });

    // Get career skills if student has a career goal
    let careerSkillIds = new Set();
    if (profile?.careerGoalId) {
      const careerSkills = await prisma.careerSkill.findMany({
        where: { careerId: profile.careerGoalId },
        include: { skill: true },
      });
      careerSkillIds = new Set(careerSkills.map((cs) => cs.skillId));
    }

    // Get all projects with their skills
    const projects = await prisma.project.findMany({
      include: {
        projectSkills: {
          include: { skill: true },
        },
      },
    });

    // Calculate match for each project
    const recommendations = [];

    for (const project of projects) {
      const projectSkillIds = project.projectSkills.map((ps) => ps.skillId);
      const projectSkillNames = project.projectSkills.map((ps) => ps.skill.name);

      // Find matching skills (skills the student has that the project needs)
      const matchedSkills = [];
      const missingSkills = [];

      for (const ps of project.projectSkills) {
        if (studentSkillIds.has(ps.skillId)) {
          matchedSkills.push(ps.skill.name);
        } else {
          missingSkills.push(ps.skill.name);
        }
      }

      // Calculate match percentage
      const totalProjectSkills = projectSkillIds.length;
      const matchPercentage = totalProjectSkills > 0
        ? Math.round((matchedSkills.length / totalProjectSkills) * 100)
        : 0;

      // Determine priority based on match and career relevance
      let priority = 'low';
      const careerRelevantSkills = projectSkillIds.filter((id) => careerSkillIds.has(id)).length;

      if (matchPercentage >= 70 && careerRelevantSkills > 0) {
        priority = 'high';
      } else if (matchPercentage >= 50 || careerRelevantSkills > 0) {
        priority = 'medium';
      }

      // Only include projects with at least some relevance
      if (matchPercentage > 0 || careerRelevantSkills > 0) {
        recommendations.push({
          projectId: project.id,
          title: project.title,
          description: project.description,
          difficulty: project.difficulty,
          estimatedHours: project.estimatedHours,
          technologies: project.technologies,
          matchPercentage,
          matchedSkills,
          missingSkills,
          priority,
          reason: this._generateReason(matchedSkills, missingSkills, project.title),
        });
      }
    }

    // Sort by match percentage (highest first), then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    recommendations.sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return recommendations.slice(0, 10); // Return top 10
  }

  _generateReason(matchedSkills, missingSkills, projectTitle) {
    if (matchedSkills.length === 0) {
      return `This project helps you build ${missingSkills.slice(0, 3).join(', ')} skills.`;
    }
    if (missingSkills.length === 0) {
      return `You have all the skills needed for ${projectTitle}. Great for portfolio building!`;
    }
    return `This project allows you to practice ${matchedSkills.slice(0, 3).join(', ')} and build ${missingSkills.slice(0, 2).join(', ')}.`;
  }
}

module.exports = new RecommendationService();
