import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Target, ArrowRight } from 'lucide-react';

export const WalkthroughModal: React.FC = () => {
  const { showWalkthrough, setShowWalkthrough, setActiveRole, loadDemoScenario } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  if (!showWalkthrough) return null;

  const steps = [
    {
      title: 'Step 1: Welcome & Landing Page',
      badge: 'Landing Experience',
      desc: 'Explore the modern pastel hero, interactive Spline 3D learning companion, brand mission ("Every step is a progress"), and the 5-step horizontal timeline.',
      actionLabel: 'Go to Landing Page',
      action: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    {
      title: 'Step 2: Student Dashboard Overview',
      badge: 'Student View',
      desc: 'Switch to the Student role. Observe current academic average, attendance, interactive progress charts, upcoming plan, and celebrate Small Wins.',
      actionLabel: 'Open Student View',
      action: () => {
        setActiveRole('student');
        loadDemoScenario('silent_struggle');
      }
    },
    {
      title: 'Step 3: Silent Struggle Detector in Action',
      badge: 'Signature Feature',
      desc: 'Notice Alex Rivera\'s Calculus scores: 86% → 78% → 69% → 58%. Even though cumulative average is above passing, STRIDE detects the downward trend early!',
      actionLabel: 'Inspect Alex Rivera Profile',
      action: () => {
        setActiveRole('student');
        loadDemoScenario('silent_struggle');
      }
    },
    {
      title: 'Step 4: Transparent Early Support Risk Engine',
      badge: 'Risk Analysis',
      desc: 'Review the weighted formula breakdown (Performance 40%, Decline 25%, Attendance 20%, Incomplete 15%). Notice human supportive language without negative labels.',
      actionLabel: 'View Transparent Warning',
      action: () => {
        setActiveRole('student');
      }
    },
    {
      title: 'Step 5: Interactive What-If Scenario Lab',
      badge: 'Simulator',
      desc: 'Simulate hypothetical study changes: "What if I attend 2 extra remedial labs?" or "What if I finish pending assignments?" Watch projected risk decrease instantly!',
      actionLabel: 'Try What-If Simulator',
      action: () => {
        setActiveRole('student');
      }
    },
    {
      title: 'Step 6: Faculty Workspace & Intervention Center',
      badge: 'Faculty View',
      desc: 'Switch to Faculty view (Dr. Sarah Jenkins). View students needing attention, review flagged evidence, and schedule a remedial mentoring session.',
      actionLabel: 'Switch to Faculty View',
      action: () => {
        setActiveRole('faculty');
      }
    },
    {
      title: 'Step 7: College Admin & CSV Batch Import',
      badge: 'Admin View',
      desc: 'Switch to Admin view (Dean Vance). View institution-wide risk heatmap, correlation analytics, and try the CSV batch import tool with instant validation.',
      actionLabel: 'Switch to Admin View',
      action: () => {
        setActiveRole('admin');
      }
    },
    {
      title: 'Step 8: Measurable Progress Tracking (Priya Sharma)',
      badge: 'Success Outcome',
      desc: 'Inspect Priya Sharma\'s record before & after remedial support (62% → 82%). STRIDE measures real post-intervention improvement over time.',
      actionLabel: 'View Priya\'s Recovery',
      action: () => {
        loadDemoScenario('recovery');
      }
    }
  ];

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-[#FFFFFF] dark:bg-[#1A2220] rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#E9EEEB] dark:border-[#293431] relative transition-all">
        {/* Close Button */}
        <button
          onClick={() => setShowWalkthrough(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#25302C] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-[#D1E5E1] dark:bg-[#253A35] text-[#202421] dark:text-[#73AFA0] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#73AFA0]" />
            {step.badge}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>

        <h3 className="text-xl font-bold text-[#202421] dark:text-[#F0F4F2] mb-3">
          {step.title}
        </h3>

        <p className="text-sm text-[#777F7B] dark:text-[#9DA8A3] mb-6 leading-relaxed">
          {step.desc}
        </p>

        {/* Action Button */}
        <div className="bg-[#E8F2F0] dark:bg-[#25302C] p-4 rounded-2xl mb-6 flex items-center justify-between">
          <span className="text-xs font-semibold text-[#202421] dark:text-[#F0F4F2]">
            Interactive Quick-Action:
          </span>
          <button
            onClick={() => {
              step.action();
            }}
            className="px-4 py-2 bg-[#73AFA0] hover:bg-[#5d9889] text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs"
          >
            <span>{step.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Bar & Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-[#293431]">
          <div className="flex items-center gap-1">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-6 bg-[#73AFA0]'
                    : idx < currentStep
                    ? 'w-2 bg-[#75A994]'
                    : 'w-2 bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="p-2 rounded-xl border border-gray-200 dark:border-[#293431] disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-[#25302C] text-gray-700 dark:text-gray-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-4 py-2 bg-[#202421] dark:bg-[#73AFA0] text-white dark:text-[#202421] font-semibold text-xs rounded-xl flex items-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowWalkthrough(false)}
                className="px-4 py-2 bg-[#75A994] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 hover:bg-[#5f8c7b] transition-colors"
              >
                <span>Finish Guide</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
