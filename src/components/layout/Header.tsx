import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Menu, X, ArrowRight, LogOut, UserCheck } from 'lucide-react';
import { NotificationsDropdown } from '../common/NotificationsDropdown';

interface HeaderProps {
  onNavigateToSection?: (sectionId: string) => void;
  onOpenLoginModal?: () => void;
  onNavigateTab?: (tab: string) => void;
  isLandingPage?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateToSection, onOpenLoginModal, onNavigateTab, isLandingPage = true }) => {
  const { isAuthenticated, currentUser, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    if (onNavigateToSection) {
      onNavigateToSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E9EEEB] sticky top-0 z-40 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('hero')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#73AFA0] to-[#5d9889] flex items-center justify-center shadow-md shadow-[#73AFA0]/20">
            {/* Custom Stride Forward Path Mark SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 17l6-6 4 4 6-8" />
              <path d="M14 7h6v6" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-[#202421]">
                STRIDE
              </span>
              <span className="w-2 h-2 rounded-full bg-[#73AFA0]" />
            </div>
            <p className="text-[11px] font-medium text-[#777F7B] leading-none">
              Every step is a progress.
            </p>
          </div>
        </div>

        {/* Desktop Navigation (Public Landing Page) */}
        {!isAuthenticated && isLandingPage && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#777F7B]">
            <button onClick={() => scrollTo('hero')} className="hover:text-[#202421] transition-colors">
              Home
            </button>
            <button onClick={() => scrollTo('how-it-works')} className="hover:text-[#202421] transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollTo('for-students')} className="hover:text-[#202421] transition-colors">
              For Students
            </button>
            <button onClick={() => scrollTo('for-faculty')} className="hover:text-[#202421] transition-colors">
              For Faculty
            </button>
            <button onClick={() => scrollTo('about')} className="hover:text-[#202421] transition-colors">
              About
            </button>
          </nav>
        )}

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated && (
            <NotificationsDropdown onNavigate={onNavigateTab} />
          )}

          {!isAuthenticated ? (
            /* Unauthenticated Public Actions */
            <>
              <button
                onClick={onOpenLoginModal}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-[#202421] bg-transparent hover:bg-[#E9EEEB] transition-colors cursor-pointer"
              >
                Log in
              </button>

              <button
                onClick={onOpenLoginModal}
                className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#202421] hover:bg-[#343B36] shadow-soft transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </>
          ) : (
            /* Authenticated User Status */
            <div className="flex items-center gap-3">
              <div className="bg-[#E8F2F0] px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-[#202421]">
                <UserCheck className="w-3.5 h-3.5 text-[#73AFA0]" />
                <span>{currentUser.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-full hover:bg-rose-50 text-rose-500 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Collapsed */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFFFF] border-b border-[#E9EEEB] px-4 py-4 flex flex-col gap-3">
          {!isAuthenticated && (
            <>
              <button onClick={() => scrollTo('hero')} className="text-left py-2 font-semibold text-gray-700">
                Home
              </button>
              <button onClick={() => scrollTo('how-it-works')} className="text-left py-2 font-semibold text-gray-700">
                How It Works
              </button>
              <button onClick={() => scrollTo('for-students')} className="text-left py-2 font-semibold text-gray-700">
                For Students
              </button>
              <button onClick={() => scrollTo('for-faculty')} className="text-left py-2 font-semibold text-gray-700">
                For Faculty
              </button>
              <button onClick={() => scrollTo('about')} className="text-left py-2 font-semibold text-gray-700">
                About
              </button>
            </>
          )}

          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            {!isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLoginModal?.();
                }}
                className="w-full py-3 text-center rounded-full font-bold text-white bg-[#202421]"
              >
                Log in / Start Your Journey
              </button>
            ) : (
              <button
                onClick={logout}
                className="w-full py-3 text-center rounded-full font-bold text-rose-500 bg-rose-50"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

