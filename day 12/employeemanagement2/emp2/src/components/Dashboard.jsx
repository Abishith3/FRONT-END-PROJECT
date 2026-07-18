import React, { useState, useEffect } from 'react';
import { formatCurrency, getInitials, formatDate } from '../utils/helpers';

const StatCard = ({ icon, label, value, change, color, bg, subtext }) => (
  <div className="stat-card" style={{ borderTop: `2px solid ${color}` }}>
    <div className="stat-card-icon" style={{ background: bg }}>
      <span style={{ fontSize: 24 }}>{icon}</span>
    </div>
    <div className="stat-card-value">{value}</div>
    <div className="stat-card-label">{label}</div>
    {change !== undefined && (
      <div className="stat-card-change" style={{ color: change >= 0 ? '#00e676' : '#ff4757' }}>
        {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
      </div>
    )}
    {subtext && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{subtext}</div>}
    <div className="stat-card-bg">{icon}</div>
  </div>
);

const MiniChart = ({ data, color }) => {
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 50 }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1, borderRadius: 4,
          background: `linear-gradient(180deg, ${color}, ${color}66)`,
          height: `${(v / max) * 100}%`,
          minHeight: 4,
          transition: 'height 0.5s ease',
          opacity: i === data.length - 1 ? 1 : 0.6,
        }} />
      ))}
    </div>
  );
};

const DonutChart = ({ segments, size = 120 }) => {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let cumulative = 0;
  const r = 45, cx = 60, cy = 60;
  const circumference = 2 * Math.PI * r;

  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const offset = circumference * (1 - cumulative);
        const dashArray = `${circumference * pct} ${circumference}`;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth="14"
            strokeDasharray={dashArray}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        );
        cumulative += pct;
        return el;
      })}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
        fill="white" fontSize="18" fontWeight="800" fontFamily="Inter, sans-serif">
        {total}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" dominantBaseline="middle"
        fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="Inter, sans-serif">
        TOTAL
      </text>
    </svg>
  );
};

export default function Dashboard({ employees, attendance, leaves, onNavigate }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const active = employees.filter(e => e.status === 'active').length;
  const onLeave = employees.filter(e => e.status === 'on-leave').length;
  const departments = [...new Set(employees.map(e => e.department))].length;
  const totalPayroll = employees.reduce((s, e) => s + e.salary, 0);
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length;

  // Today's attendance
  const today = new Date().toISOString().split('T')[0];
  const todayAtt = attendance[today] || {};
  const presentToday = Object.values(todayAtt).filter(v => v === 'present' || v === 'late').length;

  // Department distribution
  const deptCounts = {};
  employees.forEach(e => { deptCounts[e.department] = (deptCounts[e.department] || 0) + 1; });
  const deptColors = ['#6c63ff', '#00d4ff', '#00e676', '#ffa726', '#ff4757', '#ab47bc', '#ef5350', '#26c6da'];
  const deptSegments = Object.entries(deptCounts).map(([name, count], i) => ({
    name, value: count, color: deptColors[i % deptColors.length],
  }));

  // Monthly attendance trend (mock data)
  const attendanceTrend = [78, 82, 88, 85, 91, 87, 93, 89, 94, 88, 92, presentToday];

  // Top performers
  const topPerformers = [...employees].sort((a, b) => b.performance - a.performance).slice(0, 5);

  // Recent activities
  const recentActivities = [
    { icon: '👋', text: 'Riya Shah joined the Design team', time: '2 hours ago', color: '#6c63ff' },
    { icon: '💰', text: 'June payroll processed for all employees', time: '1 day ago', color: '#00e676' },
    { icon: '🏖️', text: 'Vikram Patel applied for 1 day leave', time: '2 days ago', color: '#ffa726' },
    { icon: '🎉', text: 'Aarav Sharma\'s 4th work anniversary', time: '3 days ago', color: '#ff4757' },
    { icon: '📊', text: 'Q2 performance reviews completed', time: '5 days ago', color: '#00d4ff' },
  ];

  const quickActions = [
    { icon: '➕', label: 'Add Employee', action: () => onNavigate('employees'), color: '#6c63ff', bg: 'rgba(108,99,255,0.15)' },
    { icon: '⏰', label: 'Mark Attendance', action: () => onNavigate('attendance'), color: '#00d4ff', bg: 'rgba(0,212,255,0.15)' },
    { icon: '💰', label: 'Run Payroll', action: () => onNavigate('salary'), color: '#00e676', bg: 'rgba(0,230,118,0.15)' },
    { icon: '📅', label: 'Leave Requests', action: () => onNavigate('leaves'), color: '#ffa726', bg: 'rgba(255,167,38,0.15)' },
    { icon: '📹', label: 'Video Call', action: () => onNavigate('video-call'), color: '#ff4757', bg: 'rgba(255,71,87,0.15)' },
    { icon: '📊', label: 'View Reports', action: () => onNavigate('reports'), color: '#ab47bc', bg: 'rgba(171,71,188,0.15)' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(0,212,255,0.08))',
        border: '1px solid rgba(108,99,255,0.2)',
        borderRadius: 20,
        padding: '24px 32px',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', right: -40, top: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.15), transparent)',
          pointerEvents: 'none',
        }} />
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
            Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 17 ? 'Afternoon' : 'Evening'}, Admin! 👋
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
            {currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 16 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
              <span style={{ color: '#00e676', fontWeight: 700 }}>{presentToday}</span> employees present today
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
              <span style={{ color: '#ffa726', fontWeight: 700 }}>{pendingLeaves}</span> pending leave requests
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 42, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-1px' }}>
            {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            {currentTime.toLocaleTimeString('en-IN', { second: '2-digit', hour12: false }).split(':')[2]}s
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <StatCard icon="👥" label="Total Employees" value={employees.length} change={8} color="#6c63ff" bg="rgba(108,99,255,0.15)" />
        <StatCard icon="✅" label="Active Today" value={presentToday} subtext={`of ${active} active`} color="#00e676" bg="rgba(0,230,118,0.15)" />
        <StatCard icon="💰" label="Monthly Payroll" value={formatCurrency(totalPayroll)} change={3} color="#ffa726" bg="rgba(255,167,38,0.15)" />
        <StatCard icon="📅" label="Leave Requests" value={pendingLeaves} subtext="pending approval" color="#ff4757" bg="rgba(255,71,87,0.15)" />
      </div>

      {/* Charts + Quick Actions row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 340px', gap: 20, marginBottom: 28 }}>

        {/* Attendance Trend */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>Attendance Trend</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Last 12 days</div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#00d4ff' }}>{presentToday}%</div>
          </div>
          <MiniChart data={attendanceTrend} color="#6c63ff" />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            {['Mon','Tue','Wed','Thu','Fri','Mon','Tue','Wed','Thu','Fri','Mon','Tue'].map((d, i) => (
              <div key={i} style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{d}</div>
            ))}
          </div>
        </div>

        {/* Department Distribution */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 16 }}>Department Split</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <DonutChart segments={deptSegments} />
            <div style={{ flex: 1 }}>
              {deptSegments.slice(0, 5).map((seg, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', flex: 1 }}>{seg.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{seg.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 16 }}>Quick Actions</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={action.action}
                style={{
                  background: action.bg,
                  border: `1px solid ${action.color}33`,
                  borderRadius: 12,
                  padding: '14px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.2s',
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${action.color}33`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <span style={{ fontSize: 22 }}>{action.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: action.color, textAlign: 'center', lineHeight: 1.3 }}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: Top Performers + Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

        {/* Top Performers */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 20 }}>🏆 Top Performers</div>
          {topPerformers.map((emp, i) => (
            <div key={emp.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0',
              borderBottom: i < topPerformers.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: i === 0 ? 'linear-gradient(135deg, #ffd700, #ffa500)'
                  : i === 1 ? 'linear-gradient(135deg, #c0c0c0, #a0a0a0)'
                  : i === 2 ? 'linear-gradient(135deg, #cd7f32, #a0522d)'
                  : 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0,
              }}>{i + 1}</div>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: emp.avatarColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>{getInitials(emp.name)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{emp.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{emp.role}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: emp.performance >= 90 ? '#00e676' : '#ffa726' }}>{emp.performance}%</div>
                <div className="progress-bar" style={{ width: 60, marginTop: 4 }}>
                  <div className="progress-fill" style={{
                    width: `${emp.performance}%`,
                    background: emp.performance >= 90 ? 'linear-gradient(90deg, #00e676, #00b050)' : 'linear-gradient(90deg, #ffa726, #f57c00)',
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 20 }}>🕐 Recent Activity</div>
          {recentActivities.map((activity, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '10px 0',
              borderBottom: i < recentActivities.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${activity.color}1a`,
                border: `1px solid ${activity.color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>{activity.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>{activity.text}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status overview row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Active', value: active, color: '#00e676', icon: '✅', bg: 'rgba(0,230,118,0.08)' },
          { label: 'On Leave', value: onLeave, color: '#ffa726', icon: '🏖️', bg: 'rgba(255,167,38,0.08)' },
          { label: 'Departments', value: departments, color: '#6c63ff', icon: '🏢', bg: 'rgba(108,99,255,0.08)' },
          { label: 'Avg Performance', value: `${Math.round(employees.reduce((s, e) => s + e.performance, 0) / employees.length)}%`, color: '#00d4ff', icon: '📈', bg: 'rgba(0,212,255,0.08)' },
        ].map((item, i) => (
          <div key={i} style={{
            background: item.bg, border: `1px solid ${item.color}22`,
            borderRadius: 14, padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <span style={{ fontSize: 26 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
