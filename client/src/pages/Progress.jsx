import { useState, useEffect } from 'react';
import api from '../api/axios';
import { TrendingUp, Plus, Calendar, Clock, BookOpen } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

export default function Progress() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    study_hours: '',
    completed_roadmap_items: '',
    completed_projects: '',
    readiness_percentage: '',
    skills_improved: '',
    date: '',
  });

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await api.get('/progress');
      setProgress(res.data.data.progress);
    } catch (err) {
      console.error('Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  const logProgress = async (e) => {
    e.preventDefault();
    try {
      await api.post('/progress/log', {
        study_hours: parseFloat(form.study_hours),
        completed_roadmap_items: parseInt(form.completed_roadmap_items) || 0,
        completed_projects: parseInt(form.completed_projects) || 0,
        readiness_percentage: parseFloat(form.readiness_percentage) || 0,
        skills_improved: form.skills_improved ? form.skills_improved.split(',').map((s) => s.trim()) : [],
        date: form.date || undefined,
      });
      await fetchProgress();
      setShowForm(false);
      setForm({ study_hours: '', completed_roadmap_items: '', completed_projects: '', readiness_percentage: '', skills_improved: '', date: '' });
    } catch (err) {
      console.error('Failed to log progress');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  const chartData = progress.slice().reverse();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Progress Tracking</h1>
          <p className="text-gray-500 mt-1">Monitor your learning journey</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Log Progress
        </button>
      </div>

      {/* Log Form */}
      {showForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Log Today's Progress</h3>
          <form onSubmit={logProgress} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Study Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.study_hours}
                  onChange={(e) => setForm({ ...form, study_hours: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 3.5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roadmap Items Completed</label>
                <input
                  type="number"
                  value={form.completed_roadmap_items}
                  onChange={(e) => setForm({ ...form, completed_roadmap_items: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Projects Completed</label>
                <input
                  type="number"
                  value={form.completed_projects}
                  onChange={(e) => setForm({ ...form, completed_projects: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Readiness %</label>
                <input
                  type="number"
                  value={form.readiness_percentage}
                  onChange={(e) => setForm({ ...form, readiness_percentage: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 65"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills Improved</label>
                <input
                  type="text"
                  value={form.skills_improved}
                  onChange={(e) => setForm({ ...form, skills_improved: e.target.value })}
                  className="input-field"
                  placeholder="e.g., React, JavaScript"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">Log Progress</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Readiness Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                <Area type="monotone" dataKey="readinessPercentage" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorReadiness)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Hours Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                <Line type="monotone" dataKey="studyHours" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Progress Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Progress</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Study Hours</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Items Done</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Projects</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Readiness</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Skills</th>
              </tr>
            </thead>
            <tbody>
              {progress.slice(0, 10).map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(p.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {p.studyHours}h
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{p.completedRoadmapItems}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{p.completedProjects}</td>
                  <td className="py-3 px-4">
                    <span className="badge bg-brand-100 text-brand-700">{p.readinessPercentage}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {p.skillsImproved?.slice(0, 2).map((s) => (
                        <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {progress.length === 0 && (
          <p className="text-center py-8 text-gray-500">No progress data yet. Start logging your progress!</p>
        )}
      </div>
    </div>
  );
}
