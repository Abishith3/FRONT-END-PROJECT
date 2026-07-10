import React, { useState, useEffect } from 'react';
import { EmployeeProvider } from './context/EmployeeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import AttendanceTracker from './components/AttendanceTracker';
import SchedulePlanner from './components/SchedulePlanner';
import PayrollManager from './components/PayrollManager';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ems_theme') || 'dark';
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('ems_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'employees':
        return <EmployeeManagement />;
      case 'attendance':
        return <AttendanceTracker />;
      case 'schedule':
        return <SchedulePlanner />;
      case 'payroll':
        return <PayrollManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="main-content">
        {renderActiveView()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <EmployeeProvider>
      <MainAppContent />
    </EmployeeProvider>
  );
}
