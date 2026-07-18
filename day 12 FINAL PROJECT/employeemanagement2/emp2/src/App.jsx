import React, { useState, useEffect, useCallback } from 'react';
import './index.css';
import './App.css';

import Login from './components/Login';
import EmployeePortal from './components/EmployeePortal';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import EmployeeDetail from './components/EmployeeDetail';
import AttendanceManager from './components/AttendanceManager';
import SalaryManager from './components/SalaryManager';
import LeaveManager from './components/LeaveManager';
import VideoCall from './components/VideoCall';
import Notifications from './components/Notifications';
import Reports from './components/Reports';

import {
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';

// Persist to localStorage
const load = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch { return fallback; }
};
const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState(() => load('ems_auth_user', null));

  const [employees, setEmployees] = useState(() => load('ems_employees', INITIAL_EMPLOYEES));
  const [attendance, setAttendance] = useState(() => load('ems_attendance', INITIAL_ATTENDANCE));
  const [leaves, setLeaves] = useState(() => load('ems_leaves', INITIAL_LEAVES));
  const [notifications, setNotifications] = useState(() => load('ems_notifications', INITIAL_NOTIFICATIONS));

  const [activePage, setActivePage] = useState('dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [videoCallTarget, setVideoCallTarget] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [toast, setToast] = useState(null);

  // Persist changes
  useEffect(() => { save('ems_employees', employees); }, [employees]);
  useEffect(() => { save('ems_attendance', attendance); }, [attendance]);
  useEffect(() => { save('ems_leaves', leaves); }, [leaves]);
  useEffect(() => { save('ems_notifications', notifications); }, [notifications]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    save('ems_auth_user', user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ems_auth_user');
    setActivePage('dashboard');
  };

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const handleNavigate = (page, data = null) => {
    if (page === 'employee-detail') {
      setSelectedEmployee(data);
      setActivePage('employee-detail');
    } else if (page === 'video-call') {
      setVideoCallTarget(data);
      setActivePage('video-call');
    } else {
      setActivePage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Employee CRUD
  const handleAddEmployee = (emp) => {
    setEmployees(prev => [emp, ...prev]);
    setNotifications(prev => [{
      id: 'N' + Date.now(), type: 'employee',
      title: 'New Employee Added',
      message: `${emp.name} has been added to the ${emp.department} team.`,
      time: 'Just now', read: false, icon: '👋',
    }, ...prev]);
    showToast(`✅ ${emp.name} added successfully!`);
  };

  const handleUpdateEmployee = (id, updates) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    showToast('✅ Employee updated successfully!');
  };

  const handleDeleteEmployee = (id) => {
    const emp = employees.find(e => e.id === id);
    if (window.confirm(`Remove ${emp?.name} from the system?`)) {
      setEmployees(prev => prev.filter(e => e.id !== id));
      showToast(`🗑️ ${emp?.name} removed.`, 'warning');
    }
  };

  // Attendance
  const handleUpdateAttendance = (date, empId, status) => {
    setAttendance(prev => ({
      ...prev,
      [date]: { ...(prev[date] || {}), [empId]: status },
    }));
  };

  // Leaves
  const handleUpdateLeave = (id, status) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    const lv = leaves.find(l => l.id === id);
    if (lv) {
      const msg = status === 'approved'
        ? `Leave approved for ${lv.empName}`
        : `Leave rejected for ${lv.empName}`;
      showToast(status === 'approved' ? `✅ ${msg}` : `❌ ${msg}`, status === 'approved' ? 'success' : 'warning');
      setNotifications(prev => [{
        id: 'N' + Date.now(), type: 'leave',
        title: `Leave ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `${lv.empName}'s leave request has been ${status}.`,
        time: 'Just now', read: false,
        icon: status === 'approved' ? '✅' : '❌',
      }, ...prev]);
    }
  };

  const handleAddLeave = (lv) => {
    setLeaves(prev => [lv, ...prev]);
    showToast('📅 Leave request submitted!');
  };

  // Notifications
  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // ── Not logged in → show Login ──────────────────────────────────────
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // ── Employee Role → Employee Portal ────────────────────────────────
  if (currentUser.role === 'employee') {
    return (
      <EmployeePortal
        user={currentUser}
        employees={employees}
        attendance={attendance}
        leaves={leaves}
        notifications={notifications}
        onLogout={handleLogout}
        onAddLeave={handleAddLeave}
        onMarkRead={handleMarkRead}
      />
    );
  }

  // ── Admin Role → Full Admin Portal ─────────────────────────────────
  const sidebarWidth = sidebarCollapsed ? 72 : 260;

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard employees={employees} attendance={attendance} leaves={leaves} onNavigate={handleNavigate} />;
      case 'employees':
        return (
          <EmployeeList
            employees={employees}
            onAddEmployee={handleAddEmployee}
            onUpdateEmployee={handleUpdateEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            onNavigate={handleNavigate}
          />
        );
      case 'employee-detail':
        return (
          <EmployeeDetail
            employee={selectedEmployee}
            attendance={attendance}
            leaves={leaves}
            onBack={() => setActivePage('employees')}
            onNavigate={handleNavigate}
          />
        );
      case 'attendance':
        return (
          <AttendanceManager
            employees={employees}
            attendance={attendance}
            onUpdateAttendance={handleUpdateAttendance}
          />
        );
      case 'salary':
        return <SalaryManager employees={employees} />;
      case 'leaves':
        return (
          <LeaveManager
            employees={employees}
            leaves={leaves}
            onUpdateLeave={handleUpdateLeave}
            onAddLeave={handleAddLeave}
          />
        );
      case 'reports':
        return <Reports employees={employees} attendance={attendance} leaves={leaves} />;
      case 'video-call':
        return <VideoCall employees={employees} callee={videoCallTarget} />;
      case 'notifications':
        return (
          <Notifications
            notifications={notifications}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
          />
        );
      default:
        return <Dashboard employees={employees} attendance={attendance} leaves={leaves} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        employees={employees}
      />

      {/* Main content */}
      <div style={{
        marginLeft: sidebarWidth,
        flex: 1,
        transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <Header
          activePage={activePage}
          onToggleSidebar={() => setSidebarCollapsed(c => !c)}
          onNavigate={handleNavigate}
          notifications={notifications}
          employees={employees}
          onSearch={setGlobalSearch}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Page content */}
        <main style={{
          flex: 1,
          padding: '94px 28px 32px',
          maxWidth: '100%',
          overflowX: 'hidden',
        }}>
          {renderPage()}
        </main>
      </div>

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
          background: toast.type === 'warning' ? 'rgba(255,167,38,0.15)' : 'rgba(0,230,118,0.15)',
          border: `1px solid ${toast.type === 'warning' ? 'rgba(255,167,38,0.3)' : 'rgba(0,230,118,0.3)'}`,
          backdropFilter: 'blur(20px)',
          borderRadius: 16, padding: '14px 22px',
          fontSize: 14, fontWeight: 600,
          color: toast.type === 'warning' ? '#ffa726' : '#00e676',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          maxWidth: 380,
        }}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
