import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { WalkthroughModal } from './components/common/WalkthroughModal';
import { RoleLoginModal } from './components/common/RoleLoginModal';
import { ToastContainer } from './components/common/ToastContainer';
import { FloatingAiAssistant } from './components/common/FloatingAiAssistant';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { SettingsView } from './components/common/SettingsView';

// Landing Page Sections
import { HeroSection } from './components/landing/HeroSection';
import { HowItWorks } from './components/landing/HowItWorks';
import { DashboardPreview } from './components/landing/DashboardPreview';
import { ProgressCollection } from './components/landing/ProgressCollection';
import { EarlySupportSection } from './components/landing/EarlySupportSection';
import { PersonalizedSupportSection } from './components/landing/PersonalizedSupportSection';
import { EthicsSection } from './components/landing/EthicsSection';
import { FinalCTA } from './components/landing/FinalCTA';

// Student Components
import { StudentDashboard } from './components/student/StudentDashboard';
import { MyProgress } from './components/student/MyProgress';
import { MySubjects } from './components/student/MySubjects';
import { StudyPlanner } from './components/student/StudyPlanner';
import { WhatIfLab } from './components/student/WhatIfLab';
import { MyGoals } from './components/student/MyGoals';
import { AttendancePage } from './components/student/AttendancePage';
import { StudyGuideView } from './components/student/StudyGuideView';

// Faculty Components
import { FacultyDashboard } from './components/faculty/FacultyDashboard';
import { FacultyAttendanceView } from './components/faculty/FacultyAttendanceView';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentDirectory } from './components/admin/StudentDirectory';

const MainContent: React.FC = () => {
  const { activeRole, isAuthenticated, logout } = useApp();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const scrollToSection = (id: string) => {
    if (isAuthenticated) {
      logout();
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const renderAppContent = () => {
    if (activeTab === 'settings') {
      return <SettingsView />;
    }

    if (activeRole === 'student') {
      switch (activeTab) {
        case 'overview': return <StudentDashboard onNavigateTab={setActiveTab} />;
        case 'attendance': return <AttendancePage />;
        case 'study-guide': return <StudyGuideView />;
        case 'progress': return <MyProgress />;
        case 'subjects': return <MySubjects />;
        case 'planner': return <StudyPlanner />;
        case 'what-if': return <WhatIfLab />;
        case 'goals': return <MyGoals />;
        default: return <StudentDashboard onNavigateTab={setActiveTab} />;
      }
    }

    if (activeRole === 'faculty') {
      switch (activeTab) {
        case 'overview': return <FacultyDashboard onNavigateTab={setActiveTab} />;
        case 'attendance': return <FacultyAttendanceView />;
        case 'students': return <FacultyDashboard onNavigateTab={setActiveTab} />;
        case 'insights': return <FacultyDashboard onNavigateTab={setActiveTab} />;
        case 'support-needed': return <FacultyDashboard onNavigateTab={setActiveTab} />;
        case 'interventions': return <FacultyDashboard onNavigateTab={setActiveTab} />;
        default: return <FacultyDashboard onNavigateTab={setActiveTab} />;
      }
    }

    if (activeRole === 'admin') {
      switch (activeTab) {
        case 'overview': return <AdminDashboard onNavigateTab={setActiveTab} />;
        case 'attendance': return <FacultyAttendanceView />;
        case 'directory': return <StudentDirectory />;
        case 'analytics': return <AdminDashboard onNavigateTab={setActiveTab} />;
        case 'risk-intelligence': return <AdminDashboard onNavigateTab={setActiveTab} />;
        default: return <AdminDashboard onNavigateTab={setActiveTab} />;
      }
    }

    return <StudentDashboard onNavigateTab={setActiveTab} />;
  };

  return (
    <div className="min-h-screen bg-[#E8F2F0] text-[#202421] font-sans transition-colors relative">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Header */}
      <Header
        onNavigateToSection={scrollToSection}
        onOpenLoginModal={() => setShowLoginModal(true)}
        onNavigateTab={setActiveTab}
        isLandingPage={!isAuthenticated}
      />

      {/* Role Selection Login Modal */}
      <RoleLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccessLogin={() => setActiveTab('overview')}
      />

      {/* Interactive Walkthrough Modal */}
      <WalkthroughModal />

      {/* Floating Meta AI / WhatsApp Style Assistant */}
      <FloatingAiAssistant />

      {/* Main View Router */}
      {!isAuthenticated ? (
        /* Public Landing Page */
        <main className="w-full">
          <HeroSection
            onStartJourney={() => setShowLoginModal(true)}
            onSeeHowItWorks={() => scrollToSection('how-it-works')}
          />
          <HowItWorks />
          <DashboardPreview onExplore={() => setShowLoginModal(true)} />
          <ProgressCollection />
          <EarlySupportSection onExploreInsights={() => setShowLoginModal(true)} />
          <PersonalizedSupportSection />
          <EthicsSection />
          <FinalCTA
            onStartJourney={() => setShowLoginModal(true)}
            onNavigateToSection={scrollToSection}
          />
        </main>
      ) : (
        /* Authenticated Application Shell */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={logout}
          />
          <main className="flex-1 overflow-x-hidden">
            {renderAppContent()}
          </main>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

