import React from 'react';
import { getInitials } from '../utils/helpers';

const NAV_ITEMS = [
  { id: 'dashboard', icon: '⬡', label: 'Dashboard' },
  { id: 'employees', icon: '👥', label: 'Employees' },
  { id: 'attendance', icon: '⏰', label: 'Attendance' },
  { id: 'salary', icon: '💰', label: 'Salary' },
  { id: 'leaves', icon: '📅', label: 'Leave Manager' },
  { id: 'reports', icon: '📊', label: 'Reports' },
  { id: 'video-call', icon: '📹', label: 'Video Call' },
];

export default function Sidebar({ activePage, onNavigate, collapsed, employees }) {
  const totalActive = employees.filter(e => e.status === 'active').length;

  return (
    <aside
      style={{
        width: collapsed ? '72px' : '260px',
        height: '100vh',
        position: 'fixed',
        left: 0, top: 0,
        background: 'rgba(10, 10, 30, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{
        padding: collapsed ? '24px 0' : '24px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'linear-gradient(135deg, #6c63ff, #00d4ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
          boxShadow: '0 4px 20px rgba(108,99,255,0.4)',
        }}>⚡</div>
        {!collapsed && (
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px', color: '#fff' }}>NexaCorp</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>EMS Pro</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
        {NAV_ITEMS.map(item => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: collapsed ? '14px 0' : '13px 20px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: isActive
                  ? 'linear-gradient(90deg, rgba(108,99,255,0.25), rgba(108,99,255,0.05))'
                  : 'transparent',
                border: 'none',
                borderLeft: isActive ? '3px solid #6c63ff' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                borderRadius: collapsed ? 0 : '0 12px 12px 0',
                marginRight: collapsed ? 0 : 12,
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
                }
              }}
              title={collapsed ? item.label : ''}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <div style={{
                  marginLeft: 'auto',
                  width: 6, height: 6,
                  borderRadius: '50%',
                  background: '#6c63ff',
                  boxShadow: '0 0 8px #6c63ff',
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer - Employee count */}
      {!collapsed && (
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            background: 'rgba(108,99,255,0.1)',
            border: '1px solid rgba(108,99,255,0.2)',
            borderRadius: 12,
            padding: '12px 14px',
          }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.7px' }}>Active Employees</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{totalActive}</div>
              <div style={{ display: 'flex' }}>
                {employees.slice(0, 3).map((emp, i) => (
                  <div key={emp.id} style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: emp.avatarColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700, color: '#fff',
                    border: '2px solid #0a0b1e',
                    marginLeft: i > 0 ? -8 : 0,
                  }}>{getInitials(emp.name)}</div>
                ))}
                {employees.length > 3 && (
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700, color: '#fff',
                    border: '2px solid #0a0b1e',
                    marginLeft: -8,
                  }}>+{employees.length - 3}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
