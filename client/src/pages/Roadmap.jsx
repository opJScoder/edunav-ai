import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Map, ChevronDown, ChevronRight, CheckCircle2, Circle, Clock, Sparkles } from 'lucide-react';

export default function Roadmap() {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState('');

  useEffect(() => {
    fetchRoadmaps();
    fetchCareers();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const res = await api.get('/roadmap');
      setRoadmaps(res.data.data.roadmaps);
    } catch (err) {
      console.error('Failed to load roadmaps');
    } finally {
      setLoading(false);
    }
  };

  const fetchCareers = async () => {
    try {
      const res = await api.get('/careers');
      setCareers(res.data.data.careers);
    } catch (err) {
      console.error('Failed to load careers');
    }
  };

  const generateRoadmap = async () => {
    if (!selectedCareer) return;
    setGenerating(true);
    try {
      await api.post('/roadmap/generate', { careerId: selectedCareer });
      await fetchRoadmaps();
      setShowGenerate(false);
      setSelectedCareer('');
    } catch (err) {
      console.error('Failed to generate roadmap');
    } finally {
      setGenerating(false);
    }
  };

  const updateItemStatus = async (itemId, status) => {
    try {
      await api.put(`/roadmap/item/${itemId}`, { status });
      await fetchRoadmaps();
    } catch (err) {
      console.error('Failed to update item');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Learning Roadmap</h1>
          <p className="text-gray-500 mt-1">Your personalized learning paths</p>
        </div>
        <button onClick={() => setShowGenerate(!showGenerate)} className="btn-primary flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Generate Roadmap
        </button>
      </div>

      {/* Generate Form */}
      {showGenerate && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate New Roadmap</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            >
              <option value="">Select a career path...</option>
              {careers.map((career) => (
                <option key={career.id} value={career.id}>{career.title}</option>
              ))}
            </select>
            <button
              onClick={generateRoadmap}
              disabled={!selectedCareer || generating}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      )}

      {/* Roadmaps List */}
      <div className="space-y-4">
        {roadmaps.map((roadmap) => (
          <div key={roadmap.id} className="card">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpanded(expanded === roadmap.id ? null : roadmap.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <Map className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{roadmap.title}</h3>
                  <p className="text-sm text-gray-500">{roadmap.career?.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`badge ${getStatusColor(roadmap.status)}`}>
                  {roadmap.status.replace('_', ' ')}
                </span>
                {expanded === roadmap.id ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
              </div>
            </div>

            {expanded === roadmap.id && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Readiness: {roadmap.readinessAtCreation}%</span>
                  <span>Est. Hours: {roadmap.estimatedTotalHours}</span>
                  <span>Items: {roadmap.roadmapItems?.length || 0}</span>
                </div>
                <div className="space-y-2">
                  {roadmap.roadmapItems?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {getStatusIcon(item.status)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.estimatedHours}h - {item.difficulty}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-brand-500"
                            style={{ width: `${item.progressPercentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8">{item.progressPercentage}%</span>
                        {item.status !== 'completed' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); updateItemStatus(item.id, 'completed'); }}
                            className="text-xs text-green-600 hover:text-green-700 font-medium"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {roadmaps.length === 0 && (
        <div className="text-center py-12">
          <Map className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No roadmaps yet. Generate your first learning roadmap!</p>
        </div>
      )}
    </div>
  );
}
