import { useState, useEffect } from 'react';
import api from '../api/axios';
import { FolderOpen, Clock, Star, Sparkles } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    fetchProjects();
    fetchRecommended();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data.projects);
    } catch (err) {
      console.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommended = async () => {
    try {
      const res = await api.get('/projects/recommended');
      setRecommended(res.data.data.recommendations);
    } catch (err) {
      console.error('Failed to load recommendations');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <p className="text-gray-500 mt-1">Build real-world projects to boost your skills</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'all' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          All Projects
        </button>
        <button
          onClick={() => setTab('recommended')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${tab === 'recommended' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          <Sparkles className="w-4 h-4" />
          Recommended
        </button>
      </div>

      {/* Recommended Projects */}
      {tab === 'recommended' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommended.map((proj) => (
            <div key={proj.projectId} className="card hover:shadow-md transition-shadow border-2 border-brand-100">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-brand-600" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${getPriorityColor(proj.priority)}`}>
                    {proj.priority}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-brand-600">
                    <Star className="w-4 h-4" />
                    {proj.matchPercentage}%
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{proj.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{proj.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {proj.technologies?.slice(0, 3).map((tech) => (
                  <span key={tech} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {proj.estimatedHours}h
                </span>
                <span className={`badge ${getDifficultyColor(proj.difficulty)}`}>
                  {proj.difficulty}
                </span>
              </div>
              {proj.matchedSkills?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Matched Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {proj.matchedSkills.map((skill) => (
                      <span key={skill} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* All Projects */}
      {tab === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-brand-600" />
                </div>
                <span className={`badge ${getDifficultyColor(project.difficulty)}`}>
                  {project.difficulty}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {project.technologies?.slice(0, 4).map((tech) => (
                  <span key={tech} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {project.estimatedHours}h
                </span>
                <span>{project.branchCompatibility?.length || 0} branches</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'recommended' && recommended.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No recommendations available yet. Complete your profile first!</p>
        </div>
      )}
    </div>
  );
}
