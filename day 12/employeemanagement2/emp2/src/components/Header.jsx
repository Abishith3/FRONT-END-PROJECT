import React, { useState, useRef, useEffect } from 'react';
import { getInitials } from '../utils/helpers';

const PAGE_TITLES = {
  dashboard: { title: 'Dashboard', subtitle: 'Welcome back! Here\'s what\'s happening.' },
  employees: { title: 'Employees', subtitle: 'Manage your workforce' },
  attendance: { title: 'Attendance', subtitle: 'Track daily attendance records' },
  salary: { title: 'Salary Management', subtitle: 'Payroll & compensation' },
  leaves: { title: 'Leave Manager', subtitle: 'Manage leave requests' },
  reports: { title: 'Reports', subtitle: 'Analytics & insights' },
  'video-call': { title: 'Video Call', subtitle: 'Connect with your team' },
  'employee-detail': { title: 'Employee Profile', subtitle: 'Detailed employee information' },
  notifications: { title: 'Notifications', subtitle: 'Your notification center' },
};

export default function Header({ activePage, onToggleSidebar, onNavigate, notifications, employees, onSearch, currentUser, onLogout }) {
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  const unread = notifications.filter(n => !n.read).length;
  const pageInfo = PAGE_TITLES[activePage] || PAGE_TITLES.dashboard;
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifPanel(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (val) => {
    setSearchVal(val);
    onSearch(val);
    if (val.trim()) {
      const results = employees.filter(e =>
        e.name.toLowerCase().includes(val.toLowerCase()) ||
        e.id.toLowerCase().includes(val.toLowerCase()) ||
        e.department.toLowerCase().includes(val.toLowerCase()) ||
        e.role.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <header style={{
      height: 70,
      position: 'fixed',
      top: 0, right: 0, left: 260,
      background: 'rgba(6, 8, 24, 0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 28px',
      gap: 16,
      zIndex: 99,
      transition: 'left 0.3s',
    }}>
      {/* Toggle sidebar */}
      <button
        onClick={onToggleSidebar}
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10,
          width: 38, height: 38,
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.7)',
          fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.2)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
      >☰</button>

      {/* Page title */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{pageInfo.title}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{pageInfo.subtitle}</div>
      </div>

      {/* Search */}
      <div ref={searchRef} style={{ position: 'relative' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: searchFocused ? 'rgba(108,99,255,0.08)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${searchFocused ? '#6c63ff' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 24,
          padding: '9px 16px',
          transition: 'all 0.2s',
          width: 260,
          boxShadow: searchFocused ? '0 0 0 3px rgba(108,99,255,0.15)' : 'none',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>🔍</span>
          <input
            value={searchVal}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder="Search employees..."
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              color: '#fff', fontSize: 13, width: '100%',
              fontFamily: 'Inter, sans-serif',
            }}
          />
          {searchVal && (
            <button onClick={() => { setSearchVal(''); setSearchResults([]); onSearch(''); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>
          )}
        </div>

        {/* Search dropdown */}
        {searchFocused && searchResults.length > 0 && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)', left: 0, right: 0,
            background: '#111230',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14,
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            zIndex: 999,
            overflow: 'hidden',
          }}>
            {searchResults.map(emp => (
              <button
                key={emp.id}
                onClick={() => { onNavigate('employee-detail', emp); setSearchVal(''); setSearchResults([]); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', padding: '12px 16px',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  transition: 'background 0.15s',
                  textAlign: 'left',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: emp.avatarColor, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>{getInitials(emp.name)}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{emp.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{emp.role} • {emp.department}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{emp.id}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Date/time */}
      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{timeStr}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{dateStr}</div>
      </div>

      {/* Notifications bell */}
      <div ref={notifRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setShowNotifPanel(p => !p)}
          style={{
            width: 42, height: 42, borderRadius: 12,
            background: showNotifPanel ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer', color: '#fff', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', transition: 'all 0.2s',
          }}
        >
          🔔
          {unread > 0 && (
            <div style={{
              position: 'absolute', top: 6, right: 6,
              width: 8, height: 8, borderRadius: '50%',
              background: '#ff4757', border: '1.5px solid #060818',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          )}
        </button>

        {/* Notification panel */}
        {showNotifPanel && (
          <div style={{
            position: 'absolute', right: 0, top: 'calc(100% + 12px)',
            width: 360, background: '#111230',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            zIndex: 999, overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>Notifications</div>
              {unread > 0 && <span style={{ fontSize: 11, background: 'rgba(255,71,87,0.15)', color: '#ff4757', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{unread} new</span>}
            </div>
            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              {notifications.slice(0, 6).map(n => (
                <div key={n.id} style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  background: n.read ? 'transparent' : 'rgba(108,99,255,0.05)',
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                }}>
                  <div style={{ fontSize: 22, flexShrink: 0 }}>{n.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{n.message}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{n.time}</div>
                  </div>
                  {!n.read && (
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#6c63ff', flexShrink: 0, marginTop: 4 }} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 20px', textAlign: 'center' }}>
              <button onClick={() => { onNavigate('notifications'); setShowNotifPanel(false); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c63ff', fontSize: 13, fontWeight: 600 }}>
                View all notifications →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Info + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{currentUser?.name || 'Admin'}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
            {currentUser?.avatar || '🛡️'} {currentUser?.role === 'admin' ? 'Administrator' : 'Employee'}
          </div>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6c63ff, #00d4ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 700, color: '#fff',
          flexShrink: 0,
          boxShadow: '0 0 16px rgba(108,99,255,0.4)',
          border: '2px solid rgba(108,99,255,0.4)',
        }}>{(currentUser?.name || 'A').charAt(0).toUpperCase()}</div>
        {onLogout && (
          <button onClick={onLogout} style={{
            padding: '6px 14px',
            background: 'rgba(255,71,87,0.08)',
            border: '1px solid rgba(255,71,87,0.2)',
            borderRadius: 8,
            color: '#ff6b7a',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}>🚪 Logout</button>
        )}
      </div>
    </header>
  );
}
