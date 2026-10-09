import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  TrendingUp, 
  BookOpen, 
  Calendar, 
  Sliders, 
  Award, 
  Settings, 
  Users, 
  AlertTriangle, 
  ShieldAlert, 
  PieChart, 
  FileText,
  LogOut,
  ChevronRight,
  Sparkles,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const { activeRole, currentStudent, currentUser } = useApp();

  interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }

  const getStudentNav = (): NavItem[] => [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'study-guide', label: 'STRIDE Study Guide', icon: Sparkles, badge: 'AI' },
    { id: 'progress', label: 'My Progress', icon: TrendingUp },
    { id: 'subjects', label: 'My Subjects', icon: BookOpen },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'what-if', label: 'What-If Lab', icon: Sliders },
    { id: 'goals', label: 'My Goals', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getFacultyNav = (): NavItem[] => [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance Portal', icon: Calendar },
    { id: 'students', label: 'My Students', icon: Users },
    { id: 'insights', label: 'Academic Insights', icon: TrendingUp },
    { id: 'support-needed', label: 'Students Needing Support', icon: AlertTriangle, badge: 'Flagged' },
    { id: 'interventions', label: 'Intervention Center', icon: TrendingUp },
    { id: 'subject-performance', label: 'Subject Performance', icon: BookOpen },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getAdminNav = (): NavItem[] => [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance System', icon: Calendar },
    { id: 'directory', label: 'Student Directory', icon: Users },
    { id: 'analytics', label: 'Academic Analytics', icon: PieChart },
    { id: 'risk-intelligence', label: 'Risk Intelligence', icon: ShieldAlert, badge: 'Risk' },
    { id: 'subject-insights', label: 'Subject Insights', icon: BookOpen },
    { id: 'interventions', label: 'Intervention Center', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const navItems = activeRole === 'student' ? getStudentNav() : activeRole === 'faculty' ? getFacultyNav() : getAdminNav();

  return (
    <aside className="w-64 bg-[#FFFFFF] border-r border-[#E9EEEB] flex flex-col justify-between h-[calc(100vh-5rem)] sticky top-20 transition-all rounded-3xl p-4 shadow-soft">
      {/* Top Profile Pill */}
      <div>
        <div className="bg-[#E8F2F0] p-3.5 rounded-2xl flex items-center gap-3 mb-5 border border-[#D1E5E1]">
          <img
            src={activeRole === 'student' ? currentStudent.avatar : currentUser.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-[#73AFA0]"
          />
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-[#202421] truncate">
              {currentUser.name}
            </h4>
            <p className="text-[11px] text-[#777F7B] capitalize truncate">
              {activeRole} • {currentUser.department || 'Computer Science'}
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#73AFA0] text-white shadow-xs font-bold'
                    : 'text-[#777F7B] hover:bg-[#E8F2F0] hover:text-[#202421]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#73AFA0]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#D1E5E1] text-[#202421]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-[#E9EEEB]">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#777F7B] hover:bg-rose-50 hover:text-rose-600 transition-all"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Sign Out</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>
      </div>
    </aside>
  );
};

