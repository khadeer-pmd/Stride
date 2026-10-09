import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { simulateWhatIfScenario } from '../../lib/riskEngine';
import { RiskBadge } from '../common/RiskBadge';
import { Sliders, Sparkles, TrendingUp, CheckCircle2, ArrowRight, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WhatIfLab: React.FC = () => {
  const { currentStudent, addStudyTask } = useApp();
  
  const [extraAssignments, setExtraAssignments] = useState(2);
  const [remedialSessions, setRemedialSessions] = useState(2);
  const [targetScoreIncrease, setTargetScoreIncrease] = useState(15);
  const [goalSaved, setGoalSaved] = useState(false);

  const scenario = simulateWhatIfScenario(currentStudent, {
    extraAssignmentsCompleted: extraAssignments,
    remedialSessionsPerWeek: remedialSessions,
    projectedMathScoreIncrease: targetScoreIncrease
  });

  const handleSaveGoal = () => {
    addStudyTask({
      title: `What-If Goal: Complete ${extraAssignments} extra assignments & attend ${remedialSessions} remedial sessions`,
      subjectName: 'Mathematics',
      durationMinutes: 45,
      completed: false,
      priority: 'high',
      category: 'revision',
      dueDate: 'Next Week'
    });

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    setGoalSaved(true);
    setTimeout(() => setGoalSaved(false), 4000);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A2220] p-6 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft">
        <span className="px-3 py-1 rounded-full bg-[#D1E5E1] text-[#3B6E63] text-xs font-bold uppercase tracking-wider">
          ACADEMIC SCENARIO SIMULATOR
        </span>
        <h2 className="text-2xl font-extrabold text-[#202421] dark:text-[#F0F4F2] mt-2 mb-1">
          Explore Your Next Step
        </h2>
        <p className="text-xs text-[#777F7B] dark:text-[#9DA8A3]">
          Adjust the sliders below to see how small study changes can transform your term trajectory.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sliders Control Panel */}
        <div className="lg:col-span-6 bg-[#FFFFFF] dark:bg-[#1A2220] p-6 sm:p-8 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft space-y-6">
          <h3 className="text-base font-bold text-[#202421] dark:text-[#F0F4F2] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#73AFA0]" />
            <span>Hypothetical Scenario Controls</span>
          </h3>

          {/* Slider 1: Assignments */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#202421] dark:text-[#F0F4F2]">Complete Pending Assignments</span>
              <span className="text-[#73AFA0] font-bold">+{extraAssignments} Assignments</span>
            </div>
            <input
              type="range"
              min="0"
              max={currentStudent.pendingAssignments}
              value={extraAssignments}
              onChange={(e) => setExtraAssignments(Number(e.target.value))}
              className="w-full accent-[#73AFA0]"
            />
            <p className="text-[11px] text-[#777F7B]">
              Completing {extraAssignments} of your {currentStudent.pendingAssignments} pending assignments.
            </p>
          </div>

          {/* Slider 2: Remedial Sessions */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#202421] dark:text-[#F0F4F2]">Attend Remedial Workshops</span>
              <span className="text-[#73AFA0] font-bold">{remedialSessions} Sessions/Week</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              value={remedialSessions}
              onChange={(e) => setRemedialSessions(Number(e.target.value))}
              className="w-full accent-[#73AFA0]"
            />
            <p className="text-[11px] text-[#777F7B]">
              Attending 1-on-1 mentor labs improves attendance and calculus concept clarity.
            </p>
          </div>

          {/* Slider 3: Target Test Mark */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#202421] dark:text-[#F0F4F2]">Improve Next Math Score</span>
              <span className="text-[#73AFA0] font-bold">+{targetScoreIncrease}% Increase</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={targetScoreIncrease}
              onChange={(e) => setTargetScoreIncrease(Number(e.target.value))}
              className="w-full accent-[#73AFA0]"
            />
            <p className="text-[11px] text-[#777F7B]">
              Target score boost on upcoming Midterm 3.
            </p>
          </div>
        </div>

        {/* Projected Outcome Card */}
        <div className="lg:col-span-6 bg-[#E8F2F0] dark:bg-[#121816] p-6 sm:p-8 rounded-3xl border border-[#D1E5E1] dark:border-[#25302C] shadow-soft flex flex-col justify-between space-y-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-white text-[#202421] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 shadow-xs mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#73AFA0]" />
              PROJECTED COMPARISON
            </span>

            <h3 className="text-xl font-extrabold text-[#202421] dark:text-[#F0F4F2] mb-6">
              Simulated Progress Outcome
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white dark:bg-[#1A2220] p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <span className="text-[10px] text-[#777F7B] uppercase font-bold block">Current Average</span>
                <span className="text-2xl font-extrabold text-gray-500">{scenario.currentAverage}%</span>
                <div className="mt-2">
                  <RiskBadge category={scenario.currentCategory} score={scenario.currentRiskScore} />
                </div>
              </div>

              <div className="bg-white dark:bg-[#1A2220] p-4 rounded-2xl border-2 border-[#73AFA0] shadow-soft">
                <span className="text-[10px] text-[#73AFA0] uppercase font-bold block">Projected Average</span>
                <span className="text-2xl font-extrabold text-[#75A994]">{scenario.projectedAverage}%</span>
                <div className="mt-2">
                  <RiskBadge category={scenario.projectedCategory} score={scenario.projectedRiskScore} />
                </div>
              </div>
            </div>

            <div className="bg-[#D1E5E1] p-4 rounded-2xl text-xs text-[#202421] leading-relaxed">
              🎉 <span className="font-bold">Projected Risk Reduction:</span> By taking these steps, your academic support risk score decreases by <span className="font-extrabold text-[#3B6E63]">{scenario.riskReducedBy} points</span>!
            </div>
          </div>

          <button
            onClick={handleSaveGoal}
            className="w-full py-3.5 bg-[#202421] hover:bg-[#343B36] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-soft"
          >
            <Award className="w-4 h-4 text-[#FFE7A5]" />
            <span>{goalSaved ? '✓ Goal Added to Your Study Planner!' : 'Convert Scenario into Study Goal'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
