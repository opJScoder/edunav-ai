const { z } = require('zod');

const updateProfileSchema = z.object({
  branch: z.string().min(1).max(100).optional(),
  semester: z.number().int().min(1).max(8).optional(),
  college: z.string().min(1).max(200).optional(),
  careerGoalId: z.string().uuid().optional().nullable(),
  studyHoursPerWeek: z.number().int().min(0).max(168).optional(),
  bio: z.string().max(1000).optional(),
});

module.exports = { updateProfileSchema };
