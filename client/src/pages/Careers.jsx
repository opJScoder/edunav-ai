import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Search, Briefcase, Clock, BarChart3 } from 'lucide-react';

export default function Careers() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const res = await api.get('/careers');
      setCareers(res.data.data.careers);
    } catch (err) {
      console.error('Failed to load careers');
    } finally {
      setLoading(false);
    }
  };

  const filteredCareers = careers.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
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
        <h1 className="text-2xl font-bold text-gray-900">Career Paths</h1>
        <p className="text-gray-500 mt-1">Explore different career options</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search careers..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Careers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCareers.map((career) => (
          <Link
            key={career.id}
            to={`/careers/${career.id}`}
            className="card hover:shadow-md transition-all duration-200 hover:border-brand-200 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center group-hover:bg-brand-200 transition-colors">
                <Briefcase className="w-5 h-5 text-brand-600" />
              </div>
              <span className={`badge ${getDifficultyColor(career.difficulty)}`}>
                {career.difficulty}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand-700 transition-colors">
              {career.title}
            </h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{career.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {career.averageLearningHours}h
              </span>
              <span className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                {career.careerSkills?.length || 0} skills
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredCareers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No careers found matching your search.</p>
        </div>
      )}
    </div>
  );
}
