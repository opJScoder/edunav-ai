const { z } = require('zod');

const logProgressSchema = z.object({
  study_hours: z.number().min(0).max(24),
  completed_roadmap_items: z.number().int().min(0).optional(),
  completed_projects: z.number().int().min(0).optional(),
  readiness_percentage: z.number().min(0).max(100).optional(),
  skills_improved: z.array(z.string()).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
});

module.exports = { logProgressSchema };
