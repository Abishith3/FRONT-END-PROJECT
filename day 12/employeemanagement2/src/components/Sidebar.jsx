import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  CalendarDays, 
  CircleDollarSign, 
  Sun, 
  Moon,
  ShieldAlert
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, theme, toggleTheme }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays },
    { id: 'payroll', label: 'Payroll', icon: CircleDollarSign },
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-glow">
            <ShieldAlert size={22} />
          </div>
          <span>Orbit EMS</span>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={toggleTheme} className="theme-toggle-btn">
            <span>Theme Mode</span>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          
          <div className="admin-badge">
            <div className="admin-avatar">AD</div>
            <div className="admin-info">
              <span className="admin-name">Admin Portal</span>
              <span className="admin-role">Super Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`mobile-nav-item ${activeTab === item.id ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
