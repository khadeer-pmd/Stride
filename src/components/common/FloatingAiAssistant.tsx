import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { generateCompanionResponse } from '../../lib/aiCompanion';
import type { AIAdviceResponse } from '../../lib/aiCompanion';
import { Sparkles, Send, X, Minus, Bot, Heart, CheckCircle2, Clock } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text?: string;
  structuredAdvice?: AIAdviceResponse;
  timestamp: string;
}

export const FloatingAiAssistant: React.FC = () => {
  const { currentStudent } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Hello ${currentStudent.name.split(' ')[0]}! I am Ask STRIDE, your personal AI study companion. Ask me anything about your calculus scores, revision goals, or pending tasks.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const advice = generateCompanionResponse(query, currentStudent);
      const assistantMsg: ChatMessage = {
        id: `msg-ans-${Date.now()}`,
        sender: 'assistant',
        structuredAdvice: advice,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  const samplePrompts = [
    "Help me understand my Mathematics results.",
    "Make a 7-day revision plan.",
    "Which subjects to revise first?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Animated Avatar Trigger Button */}
      {!isOpen && (
        <div className="relative group">
          {/* Tooltip */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 rounded-xl bg-[#202421] text-white text-xs font-bold whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ask STRIDE AI
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#73AFA0] via-[#5d9889] to-[#75A994] p-1 shadow-soft-lg hover:scale-105 transition-transform flex items-center justify-center relative cursor-pointer animate-float-1"
          >
            <div className="w-full h-full rounded-full bg-[#202421] dark:bg-[#1A2220] flex items-center justify-center text-white border-2 border-[#73AFA0]">
              <Sparkles className="w-6 h-6 text-[#73AFA0] animate-pulse" />
            </div>

            {/* Glowing Active Ring */}
            <span className="absolute inset-0 rounded-full border-2 border-[#73AFA0]/60 animate-ping pointer-events-none" />
            
            {/* Notification Badge Dot */}
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#F9D4E5] border-2 border-[#202421] rounded-full" />
          </button>
        </div>
      )}

      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="bg-[#FFFFFF] dark:bg-[#1A2220] rounded-[28px] w-[360px] sm:w-[400px] h-[520px] shadow-2xl border border-[#E9EEEB] dark:border-[#293431] flex flex-col justify-between overflow-hidden transition-all animate-float-1">
          
          {/* Header */}
          <div className="bg-[#E8F2F0] dark:bg-[#25302C] p-4 border-b border-[#D1E5E1] dark:border-[#293431] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#73AFA0] flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#202421] dark:text-[#F0F4F2] leading-none">
                  Ask STRIDE AI
                </h3>
                <span className="text-[10px] text-[#73AFA0] font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#75A994] animate-pulse" /> Online Study Partner
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                title="Minimize"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.text && (
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#202421] text-white dark:bg-[#73AFA0] dark:text-[#202421] font-medium'
                        : 'bg-[#E8F2F0] dark:bg-[#25302C] text-[#202421] dark:text-[#F0F4F2] border border-[#D1E5E1] dark:border-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                )}

                {msg.structuredAdvice && (
                  <div className="bg-[#FFFFFF] dark:bg-[#202825] border border-[#D1E5E1] dark:border-gray-800 p-4 rounded-2xl space-y-3 max-w-[92%] shadow-xs">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#73AFA0]">
                      <Sparkles className="w-3.5 h-3.5" /> Structured Academic Strategy
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-[#777F7B] block">1. What Needs Attention</span>
                      <p className="font-bold text-[#202421] dark:text-[#F0F4F2]">{msg.structuredAdvice.attentionTopic}</p>
                    </div>

                    <div className="bg-[#E8F2F0] dark:bg-[#25302C] p-2.5 rounded-xl">
                      <span className="text-[10px] font-bold text-[#3B6E63] dark:text-[#73AFA0] block">2. Why It Matters</span>
                      <p className="text-[11px] text-[#202421] dark:text-[#F0F4F2]">{msg.structuredAdvice.whyItMatters}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-[#777F7B] block mb-1">3. Action Steps</span>
                      <div className="space-y-1">
                        {msg.structuredAdvice.actionSteps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#73AFA0] shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="bg-[#FFE7A5] p-2 rounded-xl text-[#8C6D1F]">
                        <span className="font-bold block">Duration:</span> {msg.structuredAdvice.estimatedDuration}
                      </div>
                      <div className="bg-[#F9D4E5] p-2 rounded-xl text-[#A84B68]">
                        <span className="font-bold block">Tracking:</span> {msg.structuredAdvice.trackingMethod}
                      </div>
                    </div>
                  </div>
                )}

                <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-3 bg-[#E8F2F0] dark:bg-[#25302C] rounded-2xl w-24">
                <div className="w-2 h-2 rounded-full bg-[#73AFA0] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#73AFA0] animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-[#73AFA0] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions & Input Form */}
          <div className="p-3 border-t border-[#E9EEEB] dark:border-[#293431] bg-white dark:bg-[#1A2220] space-y-2">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="px-2.5 py-1 bg-[#E8F2F0] dark:bg-[#25302C] hover:bg-[#D1E5E1] text-[#202421] dark:text-[#F0F4F2] text-[10px] font-semibold rounded-full whitespace-nowrap transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask STRIDE AI..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-[#25302C] border border-gray-200 dark:border-gray-700 focus:outline-none text-[#202421] dark:text-[#F0F4F2]"
              />
              <button
                type="submit"
                className="p-2 bg-[#73AFA0] hover:bg-[#5d9889] text-white rounded-xl transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};
