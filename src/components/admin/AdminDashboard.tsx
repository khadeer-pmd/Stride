import React from 'react';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../common/RiskBadge';
import { Users, PieChart, ShieldAlert, HeartHandshake, TrendingUp, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart as RePieChart, Pie, Cell } from 'recharts';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const { metrics, students } = useApp();

  const riskPieData = [
    { name: 'Low Risk', value: metrics.lowRiskCount, color: '#75A994' },
    { name: 'Medium Risk', value: metrics.mediumRiskCount, color: '#E9B95F' },
    { name: 'High Risk', value: metrics.highRiskCount, color: '#D97979' }
  ];

  const departmentData = [
    { name: 'Computer Science', avg: 78, count: 142 },
    { name: 'Electrical Eng.', avg: 74, count: 98 },
    { name: 'Mechanical Eng.', avg: 76, count: 64 },
    { name: 'Civil Eng.', avg: 72, count: 38 }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A2220] p-6 sm:p-8 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#202421] dark:text-[#F0F4F2]">
            Institutional Overview — Dean Robert Vance
          </h2>
          <p className="text-xs sm:text-sm text-[#777F7B] dark:text-[#9DA8A3]">
            University academic performance monitoring, risk distribution, and intervention intelligence.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('directory')}
          className="px-5 py-2.5 bg-[#73AFA0] hover:bg-[#5d9889] text-white font-bold text-xs rounded-full flex items-center gap-1.5 transition-all shadow-xs"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Student Directory & CSV Import</span>
        </button>
      </div>

      {/* Overview Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#D1E5E1] p-5 rounded-3xl shadow-soft">
          <span className="text-xs font-bold text-[#3B6E63] uppercase">Total Enrolled Students</span>
          <h3 className="text-3xl font-extrabold text-[#202421] mt-1">{metrics.totalStudents}</h3>
          <p className="text-[11px] text-[#202421]/70 mt-1">Across 4 departments</p>
        </div>

        <div className="bg-[#FFE7A5] p-5 rounded-3xl shadow-soft">
          <span className="text-xs font-bold text-[#8C6D1F] uppercase">Overall Academic Avg</span>
          <h3 className="text-3xl font-extrabold text-[#202421] mt-1">{metrics.avgAcademicPerformance}%</h3>
          <p className="text-[11px] text-[#202421]/70 mt-1">Stable term average</p>
        </div>

        <div className="bg-[#F9D4E5] p-5 rounded-3xl shadow-soft">
          <span className="text-xs font-bold text-[#A84B68] uppercase">Attendance Rate</span>
          <h3 className="text-3xl font-extrabold text-[#202421] mt-1">{metrics.avgAttendance}%</h3>
          <p className="text-[11px] text-[#202421]/70 mt-1">Institutional lecture average</p>
        </div>

        <div className="bg-[#DCCEEB] p-5 rounded-3xl shadow-soft">
          <span className="text-xs font-bold text-[#62477E] uppercase">Total Interventions</span>
          <h3 className="text-3xl font-extrabold text-[#202421] mt-1">{metrics.openInterventions + metrics.completedInterventions}</h3>
          <p className="text-[11px] text-[#202421]/70 mt-1">{metrics.completedInterventions} completed successfully</p>
        </div>
      </div>

      {/* Grid: Risk Distribution Pie Chart & Department Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Risk Distribution Pie Chart */}
        <div className="lg:col-span-5 bg-[#FFFFFF] dark:bg-[#1A2220] p-6 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft">
          <h3 className="text-base font-bold text-[#202421] dark:text-[#F0F4F2] mb-1">
            Institutional Risk Distribution
          </h3>
          <p className="text-xs text-[#777F7B] mb-4">Categorized by transparent STRIDE Risk Model</p>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={riskPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={45} paddingAngle={4}>
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-2">
            <div className="bg-[#D1E5E1]/50 p-2 rounded-xl">
              <span className="text-[10px] text-[#3B6E63] font-bold block uppercase">Low Risk</span>
              <span className="text-sm font-extrabold text-[#202421]">{metrics.lowRiskCount}</span>
            </div>
            <div className="bg-[#FFE7A5]/50 p-2 rounded-xl">
              <span className="text-[10px] text-[#8C6D1F] font-bold block uppercase">Medium</span>
              <span className="text-sm font-extrabold text-[#202421]">{metrics.mediumRiskCount}</span>
            </div>
            <div className="bg-[#F9D4E5]/50 p-2 rounded-xl">
              <span className="text-[10px] text-[#A84B68] font-bold block uppercase">High Risk</span>
              <span className="text-sm font-extrabold text-[#202421]">{metrics.highRiskCount}</span>
            </div>
          </div>
        </div>

        {/* Department Performance Bar Chart */}
        <div className="lg:col-span-7 bg-[#FFFFFF] dark:bg-[#1A2220] p-6 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft">
          <h3 className="text-base font-bold text-[#202421] dark:text-[#F0F4F2] mb-1">
            Departmental Performance Averages
          </h3>
          <p className="text-xs text-[#777F7B] mb-4">Average academic mark across engineering faculties</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9EEEB" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#777F7B' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#777F7B' }} />
                <Tooltip />
                <Bar dataKey="avg" fill="#73AFA0" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
