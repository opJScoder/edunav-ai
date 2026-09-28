import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Target, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    semester: 1,
    target_date: '',
    status: 'not_started',
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      setGoals(res.data.data.goals);
    } catch (err) {
      console.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (e) => {
    e.preventDefault();
    try {
      await api.post('/goals', form);
      await fetchGoals();
      resetForm();
    } catch (err) {
      console.error('Failed to create goal');
    }
  };

  const updateGoal = async (id, data) => {
    try {
      await api.put(`/goals/${id}`, data);
      await fetchGoals();
      setEditingId(null);
    } catch (err) {
      console.error('Failed to update goal');
    }
  };

  const deleteGoal = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      await fetchGoals();
    } catch (err) {
      console.error('Failed to delete goal');
    }
  };

  const resetForm = () => {
    setForm({ title: '', description: '', semester: 1, target_date: '', status: 'not_started' });
    setShowForm(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Semester Goals</h1>
          <p className="text-gray-500 mt-1">Track your learning objectives</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Goal</h3>
          <form onSubmit={createGoal} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Learn React"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <select
                  value={form.semester}
                  onChange={(e) => setForm({ ...form, semester: parseInt(e.target.value) })}
                  className="input-field"
                >
                  {[1,2,3,4,5,6,7,8].map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field"
                rows={2}
                placeholder="Describe your goal..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                <input
                  type="date"
                  value={form.target_date}
                  onChange={(e) => setForm({ ...form, target_date: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="input-field"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">Create Goal</button>
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-3">
        {goals.map((goal) => (
          <div key={goal.id} className="card">
            {editingId === goal.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  defaultValue={goal.title}
                  className="input-field"
                  id={`edit-title-${goal.id}`}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const title = document.getElementById(`edit-title-${goal.id}`).value;
                      updateGoal(goal.id, { title });
                    }}
                    className="btn-primary text-sm"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="btn-secondary text-sm">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{goal.title}</h3>
                    <p className="text-xs text-gray-500">Semester {goal.semester} - Due {new Date(goal.targetDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-brand-500"
                      style={{ width: `${goal.progressPercentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-10">{goal.progressPercentage}%</span>
                  <span className={`badge ${getStatusColor(goal.status)}`}>
                    {goal.status.replace('_', ' ')}
                  </span>
                  <button onClick={() => setEditingId(goal.id)} className="p-1 text-gray-400 hover:text-brand-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteGoal(goal.id)} className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No goals yet. Create your first goal!</p>
        </div>
      )}
    </div>
  );
}
