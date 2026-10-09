import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateCompanionResponse } from '../../lib/aiCompanion';
import type { AIAdviceResponse } from '../../lib/aiCompanion';
import { Sparkles, Send, BookOpen, Clock, Target, CheckCircle2, Heart } from 'lucide-react';

export const AskStride: React.FC = () => {
  const { currentStudent } = useApp();
  const [inputQuery, setInputQuery] = useState('');
  const [activeAdvice, setActiveAdvice] = useState<AIAdviceResponse | null>(() => 
    generateCompanionResponse('Help me understand my Mathematics results.', currentStudent)
  );

  const samplePrompts = [
    "Help me understand my Mathematics results.",
    "Make a seven-day revision plan.",
    "Which subjects should I revise first?",
    "Create a plan for completing pending assignments.",
    "Explain my recent progress."
  ];

  const handleSend = (query: string) => {
    if (!query.trim()) return;
    const response = generateCompanionResponse(query, currentStudent);
    setActiveAdvice(response);
    setInputQuery('');
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-[#DCCEEB]/60 p-6 rounded-3xl border border-[#DCCEEB] shadow-soft">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#62477E]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#202421]">
              Ask STRIDE — AI Study Companion
            </h2>
            <p className="text-xs text-[#202421]/80">
              Personalized, data-backed guidance calculated strictly from your authorized records.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#777F7B] dark:text-[#9DA8A3]">Suggested Questions:</span>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3.5 py-1.5 bg-white dark:bg-[#1A2220] hover:bg-[#E8F2F0] text-[#202421] dark:text-[#F0F4F2] text-xs font-semibold rounded-full border border-[#E9EEEB] dark:border-[#293431] transition-all shadow-xs"
            >
              💬 {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-white dark:bg-[#1A2220] p-3 rounded-2xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft flex items-center gap-3">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(inputQuery)}
          placeholder="Ask STRIDE about your subjects, study schedule, or revision strategy..."
          className="flex-1 bg-transparent px-3 py-2 text-xs focus:outline-none text-[#202421] dark:text-[#F0F4F2]"
        />
        <button
          onClick={() => handleSend(inputQuery)}
          className="px-5 py-2.5 bg-[#73AFA0] hover:bg-[#5d9889] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Structured 5-Part Response View */}
      {activeAdvice && (
        <div className="bg-[#FFFFFF] dark:bg-[#1A2220] p-6 sm:p-8 rounded-3xl border border-[#E9EEEB] dark:border-[#293431] shadow-soft space-y-6">
          
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
            <span className="px-3 py-1 bg-[#D1E5E1] text-[#3B6E63] text-xs font-bold rounded-full">
              STRUCTURED ACADEMIC RECOMMENDATION
            </span>
            <span className="text-xs text-[#777F7B] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#73AFA0]" /> Rule-Based Engine Validated
            </span>
          </div>

          {/* 1. What Needs Attention */}
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-[#73AFA0] uppercase tracking-wider block">
              1. What Needs Attention
            </span>
            <h3 className="text-lg font-bold text-[#202421] dark:text-[#F0F4F2]">
              {activeAdvice.attentionTopic}
            </h3>
          </div>

          {/* 2. Why It Matters */}
          <div className="space-y-1 bg-[#E8F2F0] dark:bg-[#25302C] p-4 rounded-2xl">
            <span className="text-xs font-extrabold text-[#3B6E63] dark:text-[#73AFA0] uppercase tracking-wider block">
              2. Why It Matters
            </span>
            <p className="text-xs text-[#202421] dark:text-[#F0F4F2] leading-relaxed">
              {activeAdvice.whyItMatters}
            </p>
          </div>

          {/* 3. What the Student Can Do */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-[#73AFA0] uppercase tracking-wider block">
              3. Action Steps You Can Take
            </span>
            <div className="space-y-2">
              {activeAdvice.actionSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-[#202825] text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#73AFA0] shrink-0 mt-0.5" />
                  <span className="text-[#202421] dark:text-[#F0F4F2] font-semibold">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4 & 5. Duration & Tracking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#FFE7A5] p-4 rounded-2xl">
              <span className="text-xs font-bold text-[#8C6D1F] uppercase tracking-wider block mb-1">
                4. Estimated Duration
              </span>
              <p className="text-xs font-bold text-[#202421]">{activeAdvice.estimatedDuration}</p>
            </div>

            <div className="bg-[#F9D4E5] p-4 rounded-2xl">
              <span className="text-xs font-bold text-[#A84B68] uppercase tracking-wider block mb-1">
                5. Tracking Method
              </span>
              <p className="text-xs font-bold text-[#202421]">{activeAdvice.trackingMethod}</p>
            </div>
          </div>

          {/* Encouragement Note */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 text-xs font-semibold text-[#73AFA0]">
            <Heart className="w-4 h-4 fill-current" />
            <span>"{activeAdvice.encouragementNote}"</span>
          </div>

        </div>
      )}
    </div>
  );
};
