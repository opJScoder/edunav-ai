const { AI_PROVIDER, GEMINI_API_KEY, OPENAI_API_KEY } = require('../config/env');

/**
 * AI Service for roadmap generation
 * Supports Gemini and OpenAI with deterministic fallback
 */
class AIService {
  /**
   * Generate a learning roadmap using AI
   * @param {Object} skillGapData - The skill gap analysis data
   * @returns {Object} Generated roadmap with items
   */
  async generateRoadmap(skillGapData) {
    const { career, missingSkills, readiness } = skillGapData;

    // Try AI generation if keys are available
    if (AI_PROVIDER === 'gemini' && GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY') {
      try {
        return await this._generateWithGemini(skillGapData);
      } catch (error) {
        console.warn('Gemini AI failed, using fallback:', error.message);
      }
    }

    if (AI_PROVIDER === 'openai' && OPENAI_API_KEY && OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY') {
      try {
        return await this._generateWithOpenAI(skillGapData);
      } catch (error) {
        console.warn('OpenAI failed, using fallback:', error.message);
      }
    }

    // Deterministic fallback
    return this._generateFallbackRoadmap(skillGapData);
  }

  async _generateWithGemini(skillGapData) {
    const { career, missingSkills, readiness } = skillGapData;

    const prompt = `You are a career roadmap generator for students.
Career: ${career.title}
Current Readiness: ${readiness}%
Missing Skills: ${missingSkills.map((s) => `${s.skillName} (level ${s.currentLevel}/${s.requiredLevel})`).join(', ')}

Generate a learning roadmap with 5-8 steps. Each step should have:
- title: Short descriptive title
- description: What the student will learn
- estimatedHours: Hours needed (10-80)
- difficulty: Beginner, Intermediate, or Advanced
- resources: Array of {title, url, type}

Respond in JSON format:
{
  "title": "Roadmap title",
  "description": "Roadmap description",
  "estimatedTotalHours": number,
  "items": [
    {
      "title": "...",
      "description": "...",
      "estimatedHours": number,
      "difficulty": "...",
      "resources": [{"title": "...", "url": "...", "type": "..."}]
    }
  ]
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response');
    }

    const roadmap = JSON.parse(jsonMatch[0]);
    return this._validateRoadmap(roadmap);
  }

  async _generateWithOpenAI(skillGapData) {
    const { career, missingSkills, readiness } = skillGapData;

    const prompt = `You are a career roadmap generator for students.
Career: ${career.title}
Current Readiness: ${readiness}%
Missing Skills: ${missingSkills.map((s) => `${s.skillName} (level ${s.currentLevel}/${s.requiredLevel})`).join(', ')}

Generate a learning roadmap with 5-8 steps. Each step should have:
- title: Short descriptive title
- description: What the student will learn
- estimatedHours: Hours needed (10-80)
- difficulty: Beginner, Intermediate, or Advanced
- resources: Array of {title, url, type}

Respond in JSON format:
{
  "title": "Roadmap title",
  "description": "Roadmap description",
  "estimatedTotalHours": number,
  "items": [
    {
      "title": "...",
      "description": "...",
      "estimatedHours": number,
      "difficulty": "...",
      "resources": [{"title": "...", "url": "...", "type": "..."}]
    }
  ]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response');
    }

    const roadmap = JSON.parse(jsonMatch[0]);
    return this._validateRoadmap(roadmap);
  }

  /**
   * Deterministic fallback roadmap generator
   * Used when AI is unavailable
   */
  _generateFallbackRoadmap(skillGapData) {
    const { career, missingSkills, readiness } = skillGapData;

    // Sort missing skills by gap (highest first)
    const sortedSkills = [...missingSkills].sort((a, b) => b.gap - a.gap);

    const items = [];
    let totalHours = 0;

    // Generate items for each missing skill
    for (let i = 0; i < Math.min(sortedSkills.length, 8); i++) {
      const skill = sortedSkills[i];
      const hours = Math.max(10, Math.round(skill.requiredLevel * 15 + skill.gap * 20));
      totalHours += hours;

      items.push({
        title: `Master ${skill.skillName}`,
        description: `Learn ${skill.skillName} from level ${skill.currentLevel} to level ${skill.requiredLevel}. This is a ${skill.priority} priority skill for ${career.title}.`,
        estimatedHours: hours,
        difficulty: skill.requiredLevel <= 2 ? 'Beginner' : skill.requiredLevel <= 3 ? 'Intermediate' : 'Advanced',
        resources: [
          {
            title: `${skill.skillName} Official Documentation`,
            url: `https://www.google.com/search?q=${encodeURIComponent(skill.skillName + ' documentation')}`,
            type: 'documentation',
          },
          {
            title: `${skill.skillName} Tutorial`,
            url: `https://www.google.com/search?q=${encodeURIComponent(skill.skillName + ' tutorial')}`,
            type: 'tutorial',
          },
        ],
      });
    }

    // Add a final project item
    if (items.length > 0) {
      totalHours += 40;
      items.push({
        title: `Build a ${career.title} Portfolio Project`,
        description: `Apply all the skills you have learned by building a real-world project relevant to ${career.title}.`,
        estimatedHours: 40,
        difficulty: 'Advanced',
        resources: [
          {
            title: 'Project Ideas',
            url: 'https://github.com/topics/project-ideas',
            type: 'documentation',
          },
        ],
      });
    }

    return {
      title: `${career.title} Learning Roadmap`,
      description: `A personalized roadmap to become a ${career.title}. Current readiness: ${readiness}%.`,
      estimatedTotalHours: totalHours,
      items,
    };
  }

  _validateRoadmap(roadmap) {
    // Ensure required fields exist
    if (!roadmap.title || !Array.isArray(roadmap.items)) {
      throw new Error('Invalid roadmap structure from AI');
    }

    // Validate each item
    roadmap.items = roadmap.items.map((item, index) => ({
      title: item.title || `Step ${index + 1}`,
      description: item.description || '',
      estimatedHours: Math.max(5, parseInt(item.estimatedHours) || 20),
      difficulty: ['Beginner', 'Intermediate', 'Advanced'].includes(item.difficulty)
        ? item.difficulty
        : 'Intermediate',
      resources: Array.isArray(item.resources) ? item.resources : [],
    }));

    roadmap.estimatedTotalHours = roadmap.items.reduce((sum, item) => sum + item.estimatedHours, 0);

    return roadmap;
  }
}

module.exports = new AIService();
