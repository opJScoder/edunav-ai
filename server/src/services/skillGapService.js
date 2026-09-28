const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Skill Gap Engine
 * Compares student skills against career requirements
 * Calculates gaps, priorities, and readiness
 */
class SkillGapService {
  /**
   * Analyze skill gap for a student against a career
   * @param {string} studentId - UUID of the student
   * @param {string} careerId - UUID of the career
   * @returns {Object} Analysis result with readiness, gaps, and skill analysis
   */
  async analyze(studentId, careerId) {
    // Get career with required skills
    const career = await prisma.career.findUnique({
      where: { id: careerId },
      include: {
        careerSkills: {
          include: { skill: true },
        },
      },
    });

    if (!career) {
      const error = new Error('Career not found');
      error.code = 'P2025';
      throw error;
    }

    // Get student's skills
    const studentSkills = await prisma.studentSkill.findMany({
      where: { studentId },
      include: { skill: true },
    });

    // Build a map of student skill levels
    const studentSkillMap = {};
    for (const ss of studentSkills) {
      studentSkillMap[ss.skillId] = ss.level;
    }

    // Analyze each required skill
    const skillAnalysis = [];
    const missingSkills = [];
    let totalWeight = 0;
    let weightedReadiness = 0;

    for (const cs of career.careerSkills) {
      const studentLevel = studentSkillMap[cs.skillId] || 0;
      const requiredLevel = cs.requiredLevel;
      const weight = parseFloat(cs.weight);

      // Calculate gap: max(0, required - student) / required
      const gap = requiredLevel > 0 ? Math.max(0, requiredLevel - studentLevel) / requiredLevel : 0;

      // Determine priority
      let priority;
      if (gap === 0) priority = 'MET';
      else if (gap >= 0.6) priority = 'HIGH';
      else if (gap >= 0.3) priority = 'MEDIUM';
      else priority = 'LOW';

      // Calculate readiness contribution
      const skillReadiness = requiredLevel > 0 ? Math.min(studentLevel / requiredLevel, 1) : 1;
      weightedReadiness += skillReadiness * weight;
      totalWeight += weight;

      const analysis = {
        skillId: cs.skillId,
        skillName: cs.skill.name,
        category: cs.skill.category,
        studentLevel,
        requiredLevel,
        gap: parseFloat(gap.toFixed(2)),
        priority,
        importance: cs.importance,
        weight,
      };

      skillAnalysis.push(analysis);

      if (gap > 0) {
        missingSkills.push({
          skillId: cs.skillId,
          skillName: cs.skill.name,
          currentLevel: studentLevel,
          requiredLevel,
          gap: parseFloat(gap.toFixed(2)),
          priority,
        });
      }
    }

    // Calculate overall readiness percentage
    const readiness = totalWeight > 0 ? Math.round((weightedReadiness / totalWeight) * 100) : 0;

    // Sort skill analysis by gap (highest first)
    skillAnalysis.sort((a, b) => b.gap - a.gap);

    // Sort missing skills by priority
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    missingSkills.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return {
      career: {
        id: career.id,
        title: career.title,
        category: career.category,
        difficulty: career.difficulty,
      },
      readiness,
      missingSkills,
      skillAnalysis,
      totalRequiredSkills: career.careerSkills.length,
      metSkills: career.careerSkills.length - missingSkills.length,
    };
  }
}

module.exports = new SkillGapService();
