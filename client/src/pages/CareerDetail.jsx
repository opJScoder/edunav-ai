import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Clock, BarChart3, BookOpen, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function CareerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [career, setCareer] = useState(null);
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchCareer();
  }, [id]);

  useEffect(() => {
    if (career) {
      analyzeGap();
    }
  }, [career]);

  const fetchCareer = async () => {
    try {
      const res = await api.get(`/careers/${id}`);
      setCareer(res.data.data.career);
    } catch (err) {
      console.error('Failed to load career');
    } finally {
      setLoading(false);
    }
  };

  const analyzeGap = async () => {
    setAnalyzing(true);
    try {
      const res = await api.post('/skill-gap/analyze', { careerId: id });
      setGapAnalysis(res.data.data);
    } catch (err) {
      console.error('Failed to analyze gap');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Career not found.</p>
        <button onClick={() => navigate('/careers')} className="btn-primary mt-4">Back to Careers</button>
      </div>
    );
  }

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'HIGH': return 'bg-red-100 text-red-700';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
      case 'LOW': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-green-600';
      case 'MET': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/careers')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Careers
      </button>

      {/* Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{career.title}</h1>
            <p className="text-gray-500 mt-2">{career.description}</p>
            <div className="flex items-center gap-4 mt-4">
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {career.averageLearningHours} hours
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <BarChart3 className="w-4 h-4" />
                {career.difficulty}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <BookOpen className="w-4 h-4" />
                {career.requiredEducation}
              </span>
            </div>
          </div>
          {gapAnalysis && (
            <div className="text-center">
              <div className={`text-4xl font-bold ${gapAnalysis.readiness >= 70 ? 'text-green-600' : gapAnalysis.readiness >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                {gapAnalysis.readiness}%
              </div>
              <p className="text-sm text-gray-500">Your Readiness</p>
            </div>
          )}
        </div>
      </div>

      {/* Skill Gap Analysis */}
      {analyzing && (
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-600"></div>
            <p className="text-gray-600">Analyzing your skill gap...</p>
          </div>
        </div>
      )}

      {gapAnalysis && !analyzing && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Skill Gap Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{gapAnalysis.metSkills}</p>
              <p className="text-sm text-green-700">Skills Met</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-600">{gapAnalysis.missingSkills.length}</p>
              <p className="text-sm text-yellow-700">Skills to Learn</p>
            </div>
            <div className="p-4 bg-brand-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-brand-600">{gapAnalysis.totalRequiredSkills}</p>
              <p className="text-sm text-brand-700">Total Required</p>
            </div>
          </div>

          {/* Missing Skills */}
          {gapAnalysis.missingSkills.length > 0 && (
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-3">Skills You Need to Develop</h3>
              <div className="space-y-2">
                {gapAnalysis.missingSkills.map((skill) => (
                  <div key={skill.skillId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`w-4 h-4 ${getPriorityColor(skill.priority)}`} />
                      <span className="text-sm font-medium text-gray-900">{skill.skillName}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">Level {skill.currentLevel}/{skill.requiredLevel}</span>
                      <span className={`badge ${getPriorityColor(skill.priority)}`}>{skill.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Met Skills */}
          {gapAnalysis.skillAnalysis.filter((s) => s.gap === 0).length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-semibold text-gray-900 mb-3">Skills You Already Have</h3>
              <div className="flex flex-wrap gap-2">
                {gapAnalysis.skillAnalysis.filter((s) => s.gap === 0).map((skill) => (
                  <span key={skill.skillId} className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    <CheckCircle2 className="w-3 h-3" />
                    {skill.skillName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Required Skills */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h2>
        <div className="space-y-3">
          {career.careerSkills?.map((cs) => (
            <div key={cs.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{cs.skill.name}</p>
                <p className="text-xs text-gray-500">{cs.skill.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">Level {cs.requiredLevel}</span>
                <span className={`badge ${getImportanceColor(cs.importance)}`}>{cs.importance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
