import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, CheckCircle2, Plus, Clock, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

export const StudyPlanner: React.FC = () => {
  const { currentStudent, toggleTaskCompletion, addStudyTask } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newDuration, setNewDuration] = useState(25);
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addStudyTask({
      title: newTitle,
      subjectName: newSubject,
      durationMinutes: Number(newDuration),
      completed: false,
      priority: newPriority,
      category: 'revision',
      dueDate: 'Today'
    });
    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A2220] p-6 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#D1E5E1] text-[#3B6E63] text-xs font-bold uppercase tracking-wider">
            STUDY PLANNER
          </span>
          <h2 className="text-2xl font-extrabold text-[#202421] dark:text-[#F0F4F2] mt-2 mb-1">
            Manageable Daily & Weekly Calendar
          </h2>
          <p className="text-xs text-[#777F7B] dark:text-[#9DA8A3]">
            Short, focused study sessions prevent burnout and build steady progress.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-[#73AFA0] hover:bg-[#5d9889] text-white font-bold text-xs rounded-full flex items-center gap-1.5 transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Study Task</span>
        </button>
      </div>

      {/* Grid Layout: Calendar View & Task List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calendar Day Picker Preview */}
        <div className="lg:col-span-4 bg-[#FFFFFF] dark:bg-[#1A2220] p-6 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#202421] dark:text-[#F0F4F2]">October 2026</h3>
            <span className="text-xs font-semibold text-[#73AFA0]">Week 6</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <span key={i} className="text-[#777F7B] font-bold py-1">{day}</span>
            ))}
            {[...Array(31)].map((_, idx) => {
              const dayNum = idx + 1;
              const isSelected = dayNum === 9; // Today Oct 9
              const hasTask = dayNum === 9 || dayNum === 10 || dayNum === 12;
              return (
                <div
                  key={idx}
                  className={`py-2.5 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#73AFA0] text-white font-bold shadow-xs'
                      : hasTask
                      ? 'bg-[#D1E5E1]/60 text-[#202421]'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span>{dayNum}</span>
                  {hasTask && !isSelected && <span className="w-1 h-1 rounded-full bg-[#73AFA0] mt-0.5" />}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[#777F7B]">
              <span>Selected Date:</span>
              <span className="font-bold text-[#202421] dark:text-[#F0F4F2]">Today, Oct 9</span>
            </div>
            <div className="flex items-center justify-between text-[#777F7B]">
              <span>Estimated Time:</span>
              <span className="font-bold text-[#73AFA0]">75 minutes total</span>
            </div>
          </div>
        </div>

        {/* Tasks Checklist */}
        <div className="lg:col-span-8 bg-[#FFFFFF] dark:bg-[#1A2220] p-6 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#202421] dark:text-[#F0F4F2]">
              Today's Scheduled Tasks
            </h3>
            <span className="text-xs text-[#777F7B]">
              {currentStudent.studyTasks.filter(t => t.completed).length} of {currentStudent.studyTasks.length} Completed
            </span>
          </div>

          <div className="space-y-3">
            {currentStudent.studyTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTaskCompletion(task.id)}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  task.completed
                    ? 'bg-[#D1E5E1]/40 border-[#75A994]/40 line-through opacity-80'
                    : task.priority === 'high'
                    ? 'bg-[#F9D4E5]/30 border-[#D97979]/30'
                    : 'bg-[#E8F2F0] dark:bg-[#25302C] border-transparent hover:border-[#73AFA0]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    task.completed ? 'bg-[#75A994] border-[#75A994] text-white' : 'border-gray-400'
                  }`}>
                    {task.completed && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#202421] dark:text-[#F0F4F2]">
                      {task.title}
                    </h4>
                    <p className="text-xs text-[#777F7B] dark:text-[#9DA8A3]">
                      {task.subjectName} • Due: {task.dueDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#777F7B] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#73AFA0]" /> {task.durationMinutes}m
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    task.priority === 'high' ? 'bg-[#F9D4E5] text-[#D97979]' : 'bg-[#FFE7A5] text-[#8C6D1F]'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#1A2220] rounded-3xl max-w-md w-full p-6 border border-[#E9EEEB] shadow-2xl">
            <h3 className="text-lg font-bold text-[#202421] dark:text-[#F0F4F2] mb-4">Add Study Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#777F7B] block mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Revise calculus differential equations"
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#25302C] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#777F7B] block mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#25302C] text-xs"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Data Structures">Data Structures</option>
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Computer Networks">Computer Networks</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#777F7B] block mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#25302C] text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#73AFA0] text-white hover:bg-[#5d9889]"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
