import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Code2,
  Briefcase,
  Map,
  FolderOpen,
  Target,
  TrendingUp,
  GraduationCap,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/skills', icon: Code2, label: 'Skills' },
  { to: '/careers', icon: Briefcase, label: 'Careers' },
  { to: '/roadmap', icon: Map, label: 'Roadmap' },
  { to: '/projects', icon: FolderOpen, label: 'Projects' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto hidden md:block">
      <div className="p-4">
        <div className="flex items-center gap-2 px-3 py-2 mb-4">
          <GraduationCap className="w-5 h-5 text-brand-600" />
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Navigation</span>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 border-l-3 border-brand-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
