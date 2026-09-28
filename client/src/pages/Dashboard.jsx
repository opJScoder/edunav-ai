import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Code2,
  Target,
  FolderOpen,
  ArrowRight,
  BookOpen,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      setData(res.data.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchDashboard} className="btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  const { student, career, readiness, roadmapProgress, studyHoursThisWeek, completedProjects, skillsCompleted, totalSkills, goals, recentProgress, recommendedProjects } = data;

  const readinessColor = readiness >= 70 ? 'text-green-600' : readiness >= 40 ? 'text-yellow-600' : 'text-red-600';
  const readinessBg = readiness >= 70 ? 'bg-green-100' : readiness >= 40 ? 'bg-yellow-100' : 'bg-red-100';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {student?.name?.split(' ')[0]}</h1>
          <p className="text-gray-500 mt-1">Here's your career progress overview</p>
        </div>
        {career && (
          <div className="flex items-center gap-2 px-4 py-2 bg-brand-50 rounded-lg">
            <Target className="w-4 h-4 text-brand-600" />
            <span className="text-sm font-medium text-brand-700">{career.title}</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Zap className="w-5 h-5 text-brand-600" />}
          label="Readiness"
          value={`${readiness}%`}
          color={readinessColor}
          bgColor={readinessBg}
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-green-600" />}
          label="Roadmap Progress"
          value={`${roadmapProgress}%`}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-purple-600" />}
          label="Study Hours This Week"
          value={studyHoursThisWeek}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
        <StatCard
          icon={<Code2 className="w-5 h-5 text-orange-600" />}
          label="Skills Completed"
          value={`${skillsCompleted}/${totalSkills}`}
          color="text-orange-600"
          bgColor="bg-orange-100"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Readiness Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Readiness Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recentProgress?.slice().reverse() || []}>
                <defs>
                  <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  labelFormatter={(val) => new Date(val).toLocaleDateString()}
                />
                <Area type="monotone" dataKey="readinessPercentage" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorReadiness)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Study Hours */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Hours</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentProgress?.slice(-7).reverse() || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  labelFormatter={(val) => new Date(val).toLocaleDateString()}
                />
                <Bar dataKey="studyHours" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goals */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Goals</h3>
            <Link to="/goals" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {goals?.slice(0, 4).map((goal) => (
              <div key={goal.id} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${goal.status === 'completed' ? 'bg-green-500' : goal.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{goal.title}</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className={`h-1.5 rounded-full ${goal.status === 'completed' ? 'bg-green-500' : 'bg-brand-500'}`}
                      style={{ width: `${goal.progressPercentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-500">{goal.progressPercentage}%</span>
              </div>
            ))}
            {(!goals || goals.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">No goals yet. Create your first goal!</p>
            )}
          </div>
        </div>

        {/* Recommended Projects */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recommended Projects</h3>
            <Link to="/projects" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recommendedProjects?.slice(0, 4).map((proj) => (
              <div key={proj.projectId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-4 h-4 text-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{proj.title}</p>
                  <p className="text-xs text-gray-500">{proj.matchPercentage}% match</p>
                </div>
                <span className={`badge ${proj.priority === 'high' ? 'bg-green-100 text-green-700' : proj.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                  {proj.priority}
                </span>
              </div>
            ))}
            {(!recommendedProjects || recommendedProjects.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">No recommendations yet.</p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-brand-600" />
                <span className="text-sm text-gray-700">Branch</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{student?.branch}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-brand-600" />
                <span className="text-sm text-gray-700">Semester</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{student?.semester}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-600" />
                <span className="text-sm text-gray-700">Study Hours/Week</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{student?.studyHoursPerWeek || 0}h</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-600" />
                <span className="text-sm text-gray-700">Projects Done</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{completedProjects || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, bgColor }) {
  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bgColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
