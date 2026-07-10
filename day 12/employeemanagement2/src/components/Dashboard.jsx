import React, { useContext } from 'react';
import { EmployeeContext } from '../context/EmployeeContext';
import { 
  Users, 
  CalendarCheck, 
  CalendarDays, 
  CircleDollarSign,
  TrendingUp,
  Clock,
  UserCheck
} from 'lucide-react';

export default function Dashboard() {
  const { employees, activities } = useContext(EmployeeContext);
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculations
  const totalEmployees = employees.length;

  const presentToday = employees.filter(emp => {
    const todayRecord = emp.attendance.find(a => a.date === todayStr);
    return todayRecord && (todayRecord.status === 'Present' || todayRecord.status === 'Late');
  }).length;

  const onLeaveToday = employees.filter(emp => {
    const todayRecord = emp.attendance.find(a => a.date === todayStr);
    return todayRecord && todayRecord.status === 'On Leave';
  }).length;

  const activeEmployees = employees.filter(e => e.status === 'Active').length;

  const monthlyPayrollSim = employees.reduce((sum, emp) => {
    const base = emp.salary?.base || 0;
    const allowances = emp.salary?.allowances || 0;
    const deductions = emp.salary?.deductions || 0;
    return sum + (base + allowances - deductions);
  }, 0);

  // Department distribution
  const deptCounts = {};
  employees.forEach(emp => {
    if (emp.status === 'Active') {
      deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
    }
  });

  const depts = Object.keys(deptCounts);
  const totalDeptActive = depts.reduce((sum, d) => sum + deptCounts[d], 0);

  const deptColors = {
    Engineering: '#6366f1',
    Design: '#06b6d4',
    HR: '#10b981',
    Marketing: '#f59e0b',
    Sales: '#ec4899',
    Finance: '#8b5cf6'
  };

  // SVGs Donut Chart details
  let accumulatedAngle = 0;
  const donutData = depts.map(dept => {
    const count = deptCounts[dept];
    const percentage = totalDeptActive > 0 ? (count / totalDeptActive) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const startAngle = accumulatedAngle;
    accumulatedAngle += angle;
    return {
      name: dept,
      count,
      percentage: percentage.toFixed(0),
      color: deptColors[dept] || '#94a3b8',
      startAngle,
      endAngle: accumulatedAngle
    };
  });

  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  // Weekly attendance trend simulation (July 6 to July 10)
  const weekdays = [
    { name: 'Mon', date: '2026-07-06', rate: 100 },
    { name: 'Tue', date: '2026-07-07', rate: 100 },
    { name: 'Wed', date: '2026-07-08', rate: 100 },
    { name: 'Thu', date: '2026-07-09', rate: 83 },
    { name: 'Fri', date: '2026-07-10', rate: 66 }
  ];

  // Dynamic attendance recalculation based on actual employee data if available
  const datesToCalculate = ['2026-07-06', '2026-07-07', '2026-07-08', '2026-07-09', '2026-07-10'];
  const dynamicWeekdays = datesToCalculate.map(dateStr => {
    const dayLabel = new Date(dateStr).toLocaleDateString([], { weekday: 'short' });
    const countPresent = employees.filter(emp => {
      const rec = emp.attendance.find(a => a.date === dateStr);
      return rec && (rec.status === 'Present' || rec.status === 'Late');
    }).length;
    
    // Percentage rate
    const totalActiveEmp = employees.filter(emp => {
      // Basic check for active status on that date
      return emp.status === 'Active';
    }).length;

    const rate = totalActiveEmp > 0 ? Math.round((countPresent / totalActiveEmp) * 100) : 0;
    return { name: dayLabel, date: dateStr, rate };
  });

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Overview Dashboard</h1>
          <p className="section-subtitle">Real-time metrics, analytics, and operational updates.</p>
        </div>
        <div className="emp-meta-item">
          <Clock size={16} />
          <span>System Date: {new Date(todayStr).toLocaleDateString([], { dateStyle: 'long' })}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-grid">
        <div className="glass-card stat-card">
          <div className="stat-info">
            <span className="stat-label">Active Employees</span>
            <span className="stat-value">{activeEmployees}</span>
            <span className="section-subtitle">Total roster: {totalEmployees}</span>
          </div>
          <div className="stat-icon-box indigo">
            <Users size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-info">
            <span className="stat-label">Present Today</span>
            <span className="stat-value">{presentToday}</span>
            <span className="section-subtitle">
              Attendance: {activeEmployees > 0 ? Math.round((presentToday / activeEmployees) * 100) : 0}%
            </span>
          </div>
          <div className="stat-icon-box emerald">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-info">
            <span className="stat-label">On Leave Today</span>
            <span className="stat-value">{onLeaveToday}</span>
            <span className="section-subtitle">Approved leaves</span>
          </div>
          <div className="stat-icon-box amber">
            <CalendarCheck size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-info">
            <span className="stat-label">Monthly Payroll</span>
            <span className="stat-value">${monthlyPayrollSim.toLocaleString()}</span>
            <span className="section-subtitle">Processed & pending</span>
          </div>
          <div className="stat-icon-box rose">
            <CircleDollarSign size={24} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Weekly Attendance Rate Bar Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Weekly Attendance Trend</h3>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
              <TrendingUp size={14} /> Peak rate: 100%
            </span>
          </div>
          
          <div className="chart-container">
            <div className="bar-chart-y-axis">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
            
            <div className="svg-chart-wrapper" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '210px' }}>
              {dynamicWeekdays.map((day, idx) => {
                const heightPercent = day.rate;
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '45px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{day.rate}%</div>
                    <div style={{ 
                      width: '24px', 
                      height: `${heightPercent * 1.5}px`, 
                      background: 'var(--primary-gradient)', 
                      borderRadius: '4px 4px 0 0',
                      boxShadow: 'var(--shadow-primary)',
                      transition: 'height 0.5s ease-out'
                    }} />
                    <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>{day.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Department Distribution Donut Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Department Breakdown</h3>
          <div className="pie-chart-container">
            {/* Custom SVG Donut */}
            <svg width="140" height="140" viewBox="0 0 42 42" className="donut-svg">
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="4"></circle>
              {donutData.map((slice, idx) => {
                const strokeDasharray = `${slice.percentage} ${100 - slice.percentage}`;
                // Offset calculation (sum of percentages of previous slices)
                const previousSlicesSum = donutData.slice(0, idx).reduce((sum, s) => sum + parseFloat(s.percentage), 0);
                const strokeDashoffset = 100 - previousSlicesSum + 25; // 25 to start at 12 o'clock
                return (
                  <circle
                    key={idx}
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth="4.2"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                  />
                );
              })}
              {/* Inner Circle Label */}
              <circle cx="21" cy="21" r="11" fill="var(--bg-sidebar)"></circle>
              <text x="21" y="19" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="var(--text-main)">
                {activeEmployees}
              </text>
              <text x="21" y="25" textAnchor="middle" fontSize="3" fontWeight="600" fill="var(--text-muted)">
                ACTIVE
              </text>
            </svg>

            <div className="pie-legend">
              {donutData.map((slice, idx) => (
                <div className="legend-item" key={idx}>
                  <div className="legend-color" style={{ backgroundColor: slice.color }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.8rem' }}>
                      {slice.name} ({slice.count})
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {slice.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activities & Upcoming events */}
      <div className="charts-grid" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
        {/* Activity Feed */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Live Activity Log</h3>
          <div className="activity-list">
            {activities.length > 0 ? (
              activities.slice(0, 5).map(act => (
                <div className="activity-item" key={act.id}>
                  <div className={`activity-dot ${act.type}`} />
                  <div className="activity-content">
                    <span className="activity-text">{act.text}</span>
                    <span className="activity-time">{act.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent activity logged.</p>
            )}
          </div>
        </div>

        {/* Quick Shift View for Today */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Today's Shift Roster</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {employees.slice(0, 4).map(emp => {
              const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
              const shift = emp.schedule?.[currentDayName] || 'Morning';
              
              let shiftClass = 'shift-morning';
              if (shift === 'Afternoon') shiftClass = 'shift-afternoon';
              if (shift === 'Night') shiftClass = 'shift-night';
              if (shift === 'Off') shiftClass = 'shift-off';

              return (
                <div key={emp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <img 
                      src={emp.avatar} 
                      alt={emp.name} 
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{emp.name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{emp.role}</span>
                    </div>
                  </div>
                  <span className={`badge ${shiftClass}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                    {shift}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
