import React, { useState, useEffect } from 'react';

export default function EmployeePortal({ user, employees, attendance, leaves, notifications, onLogout, onAddLeave, onMarkRead }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [mounted, setMounted] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: 'Annual', from: '', to: '', reason: '' });

  useEffect(() => { setMounted(true); }, []);

  // Find this employee's data
  const emp = employees.find(e => e.id === user.empId) || employees[0];

  // Filter attendance / leaves for this employee
  const myLeaves = leaves.filter(l => l.empId === emp?.id);
  const myAttendance = attendance;

  // Compute attendance stats for this month
  const thisMonth = new Date().toISOString().slice(0, 7);
  let present = 0, absent = 0, late = 0;
  Object.entries(myAttendance).forEach(([date, records]) => {
    if (date.startsWith(thisMonth) && emp?.id && records[emp.id]) {
      const s = records[emp.id];
      if (s === 'present') present++;
      else if (s === 'absent') absent++;
      else if (s === 'late') late++;
    }
  });
  const totalDays = present + absent + late || 1;
  const attendancePct = Math.round((present / totalDays) * 100);

  const myNotifs = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'profile', icon: '👤', label: 'My Profile' },
    { id: 'attendance', icon: '📅', label: 'Attendance' },
    { id: 'leaves', icon: '🌿', label: 'My Leaves' },
    { id: 'salary', icon: '💰', label: 'Salary' },
    { id: 'notifications', icon: '🔔', label: 'Notifications', badge: myNotifs },
  ];

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    const newLeave = {
      id: 'L' + Date.now(),
      empId: emp.id,
      empName: emp.name,
      department: emp.department,
      type: leaveForm.type,
      from: leaveForm.from,
      to: leaveForm.to,
      reason: leaveForm.reason,
      status: 'pending',
      appliedOn: new Date().toISOString().slice(0, 10),
    };
    onAddLeave(newLeave);
    setShowLeaveModal(false);
    setLeaveForm({ type: 'Annual', from: '', to: '', reason: '' });
  };

  const renderDashboard = () => (
    <div style={ep.pageContent}>
      <h2 style={ep.pageTitle}>Welcome back, <span style={{ color: '#6c63ff' }}>{emp?.name?.split(' ')[0]} 👋</span></h2>
      <p style={ep.pageSubtitle}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

      {/* Stats Grid */}
      <div style={ep.statsGrid}>
        {[
          { label: 'Attendance', value: `${attendancePct}%`, icon: '📅', color: '#00e676', sub: `${present} days this month` },
          { label: 'Leaves Used', value: emp?.leaves?.used || 0, icon: '🌿', color: '#ffa726', sub: `${emp?.leaves?.remaining || 0} remaining` },
          { label: 'Performance', value: `${emp?.performance || 0}%`, icon: '⭐', color: '#6c63ff', sub: 'Overall score' },
          { label: 'Salary', value: `₹${((emp?.salary || 0) / 1000).toFixed(0)}K`, icon: '💰', color: '#00d4ff', sub: 'Monthly CTC' },
        ].map((s, i) => (
          <div key={i} style={ep.statCard}>
            <div style={{ ...ep.statIcon, background: `${s.color}18`, color: s.color }}>{s.icon}</div>
            <div>
              <p style={ep.statValue}>{s.value}</p>
              <p style={ep.statLabel}>{s.label}</p>
              <p style={ep.statSub}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={ep.section}>
        <h3 style={ep.sectionTitle}>Quick Actions</h3>
        <div style={ep.quickGrid}>
          {[
            { icon: '🌿', label: 'Apply Leave', color: '#00e676', action: () => setShowLeaveModal(true) },
            { icon: '📅', label: 'View Attendance', color: '#00d4ff', action: () => setActivePage('attendance') },
            { icon: '💰', label: 'View Salary', color: '#ffa726', action: () => setActivePage('salary') },
            { icon: '👤', label: 'My Profile', color: '#6c63ff', action: () => setActivePage('profile') },
          ].map((q, i) => (
            <button key={i} onClick={q.action} style={{ ...ep.quickCard, border: `1px solid ${q.color}30` }}>
              <span style={{ ...ep.quickIcon, background: `${q.color}18`, color: q.color }}>{q.icon}</span>
              <span style={ep.quickLabel}>{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Leaves */}
      <div style={ep.section}>
        <h3 style={ep.sectionTitle}>Recent Leave Requests</h3>
        {myLeaves.length === 0 ? (
          <div style={ep.emptyState}>No leave requests yet</div>
        ) : (
          <div style={ep.leaveList}>
            {myLeaves.slice(0, 4).map(l => (
              <div key={l.id} style={ep.leaveRow}>
                <div>
                  <p style={ep.leaveName}>{l.type} Leave</p>
                  <p style={ep.leaveDate}>{l.from} → {l.to}</p>
                </div>
                <span style={{ ...ep.badge, ...getBadgeStyle(l.status) }}>{l.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div style={ep.pageContent}>
      <h2 style={ep.pageTitle}>My Profile</h2>
      <div style={ep.profileCard}>
        <div style={ep.profileAvatar}>
          <div style={{ ...ep.avatarCircle, background: emp?.avatarColor || '#6c63ff' }}>
            {emp?.name?.charAt(0)}
          </div>
          <div>
            <h2 style={{ color: '#fff', margin: '0 0 4px', fontSize: 22, fontWeight: 700 }}>{emp?.name}</h2>
            <p style={{ color: '#6c63ff', margin: '0 0 4px', fontSize: 14, fontWeight: 600 }}>{emp?.role}</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', margin: 0, fontSize: 13 }}>{emp?.department}</p>
          </div>
        </div>
        <div style={ep.profileGrid}>
          {[
            { label: 'Employee ID', value: emp?.id, icon: '🆔' },
            { label: 'Email', value: emp?.email, icon: '📧' },
            { label: 'Phone', value: emp?.phone, icon: '📱' },
            { label: 'Location', value: emp?.location, icon: '📍' },
            { label: 'Join Date', value: emp?.joinDate, icon: '📅' },
            { label: 'Manager', value: emp?.manager, icon: '👔' },
          ].map((f, i) => (
            <div key={i} style={ep.profileField}>
              <span style={ep.fieldIcon}>{f.icon}</span>
              <div>
                <p style={ep.fieldLabel}>{f.label}</p>
                <p style={ep.fieldValue}>{f.value || '—'}</p>
              </div>
            </div>
          ))}
        </div>
        {emp?.skills && (
          <div style={{ marginTop: 20 }}>
            <p style={ep.fieldLabel}>Skills</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              {emp.skills.map(s => (
                <span key={s} style={ep.skillTag}>{s}</span>
              ))}
            </div>
          </div>
        )}
        {emp?.about && (
          <div style={{ marginTop: 20, padding: '14px 16px', background: 'rgba(108,99,255,0.06)', borderRadius: 12 }}>
            <p style={{ ...ep.fieldLabel, marginBottom: 6 }}>About</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0, lineHeight: 1.6 }}>{emp.about}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAttendance = () => {
    const rows = [];
    Object.entries(myAttendance)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 30)
      .forEach(([date, records]) => {
        if (emp?.id) {
          rows.push({ date, status: records[emp.id] || '—' });
        }
      });

    return (
      <div style={ep.pageContent}>
        <h2 style={ep.pageTitle}>My Attendance</h2>
        <div style={ep.statsGrid}>
          {[
            { label: 'Present', value: present, icon: '✅', color: '#00e676' },
            { label: 'Absent', value: absent, icon: '❌', color: '#ff4757' },
            { label: 'Late', value: late, icon: '⏰', color: '#ffa726' },
            { label: 'Rate', value: `${attendancePct}%`, icon: '📊', color: '#6c63ff' },
          ].map((s, i) => (
            <div key={i} style={ep.statCard}>
              <div style={{ ...ep.statIcon, background: `${s.color}18`, color: s.color }}>{s.icon}</div>
              <div>
                <p style={ep.statValue}>{s.value}</p>
                <p style={ep.statLabel}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={ep.tableWrap}>
          <table style={ep.table}>
            <thead>
              <tr>
                {['Date', 'Status'].map(h => (
                  <th key={h} style={ep.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={2} style={{ ...ep.td, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No attendance records</td></tr>
              ) : rows.map((r, i) => (
                <tr key={i} style={i % 2 === 0 ? {} : { background: 'rgba(255,255,255,0.02)' }}>
                  <td style={ep.td}>{r.date}</td>
                  <td style={ep.td}>
                    <span style={{ ...ep.badge, ...getAttBadgeStyle(r.status) }}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderLeaves = () => (
    <div style={ep.pageContent}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ ...ep.pageTitle, marginBottom: 0 }}>My Leaves</h2>
        <button onClick={() => setShowLeaveModal(true)} style={ep.applyBtn}>+ Apply Leave</button>
      </div>
      <div style={ep.statsGrid}>
        {[
          { label: 'Total', value: emp?.leaves?.total || 24, color: '#6c63ff', icon: '📋' },
          { label: 'Used', value: emp?.leaves?.used || 0, color: '#ffa726', icon: '✅' },
          { label: 'Remaining', value: emp?.leaves?.remaining || 24, color: '#00e676', icon: '🌿' },
          { label: 'Pending', value: myLeaves.filter(l => l.status === 'pending').length, color: '#00d4ff', icon: '⏳' },
        ].map((s, i) => (
          <div key={i} style={ep.statCard}>
            <div style={{ ...ep.statIcon, background: `${s.color}18`, color: s.color }}>{s.icon}</div>
            <div>
              <p style={ep.statValue}>{s.value}</p>
              <p style={ep.statLabel}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={ep.tableWrap}>
        <table style={ep.table}>
          <thead>
            <tr>
              {['Type', 'From', 'To', 'Reason', 'Status'].map(h => (
                <th key={h} style={ep.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myLeaves.length === 0 ? (
              <tr><td colSpan={5} style={{ ...ep.td, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No leave requests</td></tr>
            ) : myLeaves.map((l, i) => (
              <tr key={l.id} style={i % 2 === 0 ? {} : { background: 'rgba(255,255,255,0.02)' }}>
                <td style={ep.td}>{l.type}</td>
                <td style={ep.td}>{l.from}</td>
                <td style={ep.td}>{l.to}</td>
                <td style={{ ...ep.td, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.reason}</td>
                <td style={ep.td}><span style={{ ...ep.badge, ...getBadgeStyle(l.status) }}>{l.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSalary = () => (
    <div style={ep.pageContent}>
      <h2 style={ep.pageTitle}>My Salary</h2>
      <div style={ep.salaryCard}>
        <div style={ep.salaryTop}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 6px' }}>Monthly CTC</p>
            <p style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: 0 }}>
              ₹{(emp?.salary || 0).toLocaleString()}
            </p>
          </div>
          <div style={{ ...ep.statIcon, width: 56, height: 56, fontSize: 24, background: 'rgba(0,230,118,0.1)', color: '#00e676' }}>💰</div>
        </div>
        <div style={ep.salaryBreakdown}>
          {[
            { label: 'Basic Salary', value: Math.round((emp?.salary || 0) * 0.4), color: '#6c63ff' },
            { label: 'HRA', value: Math.round((emp?.salary || 0) * 0.2), color: '#00d4ff' },
            { label: 'Special Allowance', value: Math.round((emp?.salary || 0) * 0.2), color: '#ffa726' },
            { label: 'Performance Bonus', value: Math.round((emp?.salary || 0) * 0.1), color: '#00e676' },
            { label: 'PF Deduction', value: -Math.round((emp?.salary || 0) * 0.05), color: '#ff4757' },
            { label: 'Tax Deduction', value: -Math.round((emp?.salary || 0) * 0.05), color: '#ff4757' },
          ].map((item, i) => (
            <div key={i} style={ep.salaryRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{item.label}</span>
              </div>
              <span style={{ color: item.value < 0 ? '#ff4757' : '#fff', fontSize: 14, fontWeight: 600 }}>
                {item.value < 0 ? '-' : '+'}₹{Math.abs(item.value).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div style={ep.salaryNet}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Net Take-Home</span>
          <span style={{ color: '#00e676', fontSize: 20, fontWeight: 800 }}>
            ₹{Math.round((emp?.salary || 0) * 0.9).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div style={ep.pageContent}>
      <h2 style={ep.pageTitle}>Notifications</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notifications.length === 0 ? (
          <div style={ep.emptyState}>No notifications</div>
        ) : notifications.map(n => (
          <div key={n.id} onClick={() => onMarkRead(n.id)} style={{
            ...ep.notifRow,
            background: n.read ? 'rgba(255,255,255,0.02)' : 'rgba(108,99,255,0.08)',
            borderColor: n.read ? 'rgba(255,255,255,0.06)' : 'rgba(108,99,255,0.2)',
          }}>
            <span style={ep.notifIcon}>{n.icon || '🔔'}</span>
            <div style={{ flex: 1 }}>
              <p style={{ ...ep.leaveName, display: 'flex', alignItems: 'center', gap: 6 }}>
                {n.title}
                {!n.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6c63ff', display: 'inline-block' }} />}
              </p>
              <p style={ep.leaveDate}>{n.message}</p>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return renderDashboard();
      case 'profile': return renderProfile();
      case 'attendance': return renderAttendance();
      case 'leaves': return renderLeaves();
      case 'salary': return renderSalary();
      case 'notifications': return renderNotifications();
      default: return renderDashboard();
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#060818', fontFamily: 'Inter, sans-serif', opacity: mounted ? 1 : 0, transition: 'opacity 0.4s' }}>
      {/* Sidebar */}
      <div style={ep.sidebar}>
        <div style={ep.sidebarBrand}>
          <div style={ep.brandLogo}>⚡</div>
          <div>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: 0 }}>EmpowerHR</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>Employee Portal</p>
          </div>
        </div>

        <div style={ep.sidebarProfile}>
          <div style={{ ...ep.sideAvatarCircle, background: emp?.avatarColor || 'linear-gradient(135deg,#6c63ff,#a855f7)' }}>
            {emp?.name?.charAt(0)}
          </div>
          <div>
            <p style={{ color: '#fff', fontWeight: 600, fontSize: 13, margin: 0 }}>{emp?.name}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{emp?.role}</p>
          </div>
        </div>

        <nav style={ep.nav}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                ...ep.navItem,
                background: activePage === item.id ? 'linear-gradient(135deg,rgba(108,99,255,0.25),rgba(168,85,247,0.15))' : 'transparent',
                border: `1px solid ${activePage === item.id ? 'rgba(108,99,255,0.3)' : 'transparent'}`,
                color: activePage === item.id ? '#8b85ff' : 'rgba(255,255,255,0.55)',
              }}
            >
              <span style={ep.navIcon}>{item.icon}</span>
              <span style={ep.navLabel}>{item.label}</span>
              {item.badge > 0 && <span style={ep.navBadge}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        <button onClick={onLogout} style={ep.logoutBtn}>
          <span>🚪</span> Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Top Bar */}
        <div style={ep.topBar}>
          <div>
            <h3 style={{ color: '#fff', margin: 0, fontSize: 16, fontWeight: 600 }}>
              {navItems.find(n => n.id === activePage)?.label || 'Dashboard'}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={ep.empBadge}>
              <span style={{ color: '#00d4ff', fontSize: 12, fontWeight: 700 }}>{emp?.id}</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{user.name}</div>
          </div>
        </div>

        <div style={{ padding: '24px 28px' }}>
          {renderPage()}
        </div>
      </div>

      {/* Leave Modal */}
      {showLeaveModal && (
        <div style={ep.modalOverlay} onClick={() => setShowLeaveModal(false)}>
          <div style={ep.modal} onClick={e => e.stopPropagation()}>
            <div style={ep.modalHeader}>
              <h3 style={{ color: '#fff', margin: 0, fontSize: 18, fontWeight: 700 }}>Apply for Leave</h3>
              <button onClick={() => setShowLeaveModal(false)} style={ep.closeBtn}>✕</button>
            </div>
            <form onSubmit={handleLeaveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={ep.formGroup}>
                <label style={ep.formLabel}>Leave Type</label>
                <select
                  value={leaveForm.type}
                  onChange={e => setLeaveForm(f => ({ ...f, type: e.target.value }))}
                  style={ep.formInput}
                  required
                >
                  {['Annual', 'Sick', 'Casual', 'Emergency', 'Maternity', 'Paternity'].map(t => (
                    <option key={t} value={t}>{t} Leave</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={ep.formGroup}>
                  <label style={ep.formLabel}>From Date</label>
                  <input type="date" value={leaveForm.from} onChange={e => setLeaveForm(f => ({ ...f, from: e.target.value }))} style={ep.formInput} required />
                </div>
                <div style={ep.formGroup}>
                  <label style={ep.formLabel}>To Date</label>
                  <input type="date" value={leaveForm.to} onChange={e => setLeaveForm(f => ({ ...f, to: e.target.value }))} style={ep.formInput} required />
                </div>
              </div>
              <div style={ep.formGroup}>
                <label style={ep.formLabel}>Reason</label>
                <textarea
                  value={leaveForm.reason}
                  onChange={e => setLeaveForm(f => ({ ...f, reason: e.target.value }))}
                  placeholder="Briefly describe the reason..."
                  rows={3}
                  style={{ ...ep.formInput, resize: 'vertical', minHeight: 80 }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowLeaveModal(false)} style={ep.cancelBtn}>Cancel</button>
                <button type="submit" style={ep.submitBtn}>Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function getBadgeStyle(status) {
  const s = status?.toLowerCase();
  if (s === 'approved') return { background: 'rgba(0,230,118,0.12)', color: '#00e676', borderColor: 'rgba(0,230,118,0.25)' };
  if (s === 'rejected') return { background: 'rgba(255,71,87,0.12)', color: '#ff4757', borderColor: 'rgba(255,71,87,0.25)' };
  return { background: 'rgba(255,167,38,0.12)', color: '#ffa726', borderColor: 'rgba(255,167,38,0.25)' };
}
function getAttBadgeStyle(status) {
  if (status === 'present') return { background: 'rgba(0,230,118,0.12)', color: '#00e676', borderColor: 'rgba(0,230,118,0.25)' };
  if (status === 'absent') return { background: 'rgba(255,71,87,0.12)', color: '#ff4757', borderColor: 'rgba(255,71,87,0.25)' };
  if (status === 'late') return { background: 'rgba(255,167,38,0.12)', color: '#ffa726', borderColor: 'rgba(255,167,38,0.25)' };
  return { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', borderColor: 'rgba(255,255,255,0.1)' };
}

const ep = {
  sidebar: {
    width: 240,
    minHeight: '100vh',
    background: 'rgba(255,255,255,0.03)',
    borderRight: '1px solid rgba(255,255,255,0.07)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 12px',
    position: 'sticky',
    top: 0,
    height: '100vh',
  },
  sidebarBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '0 8px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    marginBottom: 16,
  },
  brandLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: 'linear-gradient(135deg,#6c63ff,#a855f7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
  },
  sidebarProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 8px 16px',
    marginBottom: 8,
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  sideAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    fontWeight: 700,
    color: '#fff',
    flexShrink: 0,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 10,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: 13,
    fontWeight: 500,
    textAlign: 'left',
    width: '100%',
  },
  navIcon: { fontSize: 16, width: 20, textAlign: 'center' },
  navLabel: { flex: 1 },
  navBadge: {
    background: '#6c63ff',
    color: '#fff',
    borderRadius: 10,
    padding: '2px 7px',
    fontSize: 11,
    fontWeight: 700,
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 12px',
    borderRadius: 10,
    background: 'rgba(255,71,87,0.08)',
    border: '1px solid rgba(255,71,87,0.15)',
    color: '#ff6b7a',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    width: '100%',
    marginTop: 8,
  },
  topBar: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: 'rgba(6,8,24,0.85)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    padding: '14px 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  empBadge: {
    padding: '4px 12px',
    background: 'rgba(0,212,255,0.08)',
    border: '1px solid rgba(0,212,255,0.2)',
    borderRadius: 20,
  },
  pageContent: {},
  pageTitle: {
    fontSize: 24,
    fontWeight: 800,
    color: '#fff',
    margin: '0 0 4px',
  },
  pageSubtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    margin: '0 0 24px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
    gap: 14,
    marginBottom: 28,
  },
  statCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '18px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    flexShrink: 0,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 800,
    color: '#fff',
    margin: '0 0 2px',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    margin: '0 0 2px',
  },
  statSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.25)',
    margin: 0,
  },
  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 14px',
  },
  quickGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))',
    gap: 12,
  },
  quickCard: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    padding: '16px 14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#fff',
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
  },
  quickLabel: { fontSize: 13, fontWeight: 600, color: '#fff' },
  leaveList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  leaveRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12,
  },
  leaveName: { color: '#fff', fontSize: 14, fontWeight: 600, margin: '0 0 2px' },
  leaveDate: { color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 },
  badge: {
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    border: '1px solid',
    textTransform: 'capitalize',
  },
  emptyState: {
    padding: '28px',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
    fontSize: 14,
  },
  profileCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '28px',
  },
  profileAvatar: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    marginBottom: 28,
    paddingBottom: 20,
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    fontWeight: 800,
    color: '#fff',
    flexShrink: 0,
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
    gap: 16,
  },
  profileField: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
  },
  fieldIcon: { fontSize: 18, marginTop: 2 },
  fieldLabel: { fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: 0.5 },
  fieldValue: { fontSize: 14, color: 'rgba(255,255,255,0.8)', margin: 0, fontWeight: 500 },
  skillTag: {
    padding: '4px 12px',
    background: 'rgba(108,99,255,0.12)',
    border: '1px solid rgba(108,99,255,0.25)',
    borderRadius: 20,
    fontSize: 12,
    color: '#8b85ff',
    fontWeight: 500,
  },
  tableWrap: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    background: 'rgba(255,255,255,0.03)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  td: {
    padding: '12px 16px',
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  salaryCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '28px',
    maxWidth: 560,
  },
  salaryTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  salaryBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 20,
  },
  salaryRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  salaryNet: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  notifRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '14px 16px',
    border: '1px solid',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  notifIcon: { fontSize: 20, marginTop: 2 },
  applyBtn: {
    padding: '8px 18px',
    background: 'linear-gradient(135deg,#6c63ff,#a855f7)',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(108,99,255,0.3)',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 20,
  },
  modal: {
    background: '#0d0f2b',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: '28px',
    width: '100%',
    maxWidth: 480,
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    color: 'rgba(255,255,255,0.5)',
    width: 32,
    height: 32,
    cursor: 'pointer',
    fontSize: 14,
  },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  formLabel: { fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5 },
  formInput: {
    padding: '11px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  cancelBtn: {
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg,#6c63ff,#a855f7)',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },
};
