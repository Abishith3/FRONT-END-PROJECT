import React, { useState } from 'react';
import { formatDate, getInitials } from '../utils/helpers';

const LEAVE_TYPES = ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity Leave', 'Paternity Leave', 'Compensatory Off'];

export default function LeaveManager({ employees, leaves, onUpdateLeave, onAddLeave }) {
  const [activeTab, setActiveTab] = useState('requests');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showApplyModal, setShowApplyModal] = useState(false);

  const filteredLeaves = filterStatus === 'All' ? leaves : leaves.filter(l => l.status === filterStatus);

  const pending = leaves.filter(l => l.status === 'pending').length;
  const approved = leaves.filter(l => l.status === 'approved').length;
  const rejected = leaves.filter(l => l.status === 'rejected').length;

  const statusConfig = {
    pending: { color: '#ffa726', bg: 'rgba(255,167,38,0.1)', label: 'Pending', icon: '⏳' },
    approved: { color: '#00e676', bg: 'rgba(0,230,118,0.1)', label: 'Approved', icon: '✅' },
    rejected: { color: '#ff4757', bg: 'rgba(255,71,87,0.1)', label: 'Rejected', icon: '❌' },
  };

  return (
    <div className="animate-fade-in">
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Requests', value: leaves.length, color: '#6c63ff', icon: '📋' },
          { label: 'Pending', value: pending, color: '#ffa726', icon: '⏳' },
          { label: 'Approved', value: approved, color: '#00e676', icon: '✅' },
          { label: 'Rejected', value: rejected, color: '#ff4757', icon: '❌' },
        ].map((item, i) => (
          <div key={i} style={{
            background: `${item.color}0d`, border: `1px solid ${item.color}22`,
            borderRadius: 16, padding: '20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.value}</div>
            </div>
            <span style={{ fontSize: 32 }}>{item.icon}</span>
          </div>
        ))}
      </div>

      {/* Tabs + controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
          {[['requests', '📋 Requests'], ['balance', '📊 Leave Balance'], ['calendar', '📅 Calendar']].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              style={{
                padding: '10px 18px', border: 'none', cursor: 'pointer',
                background: activeTab === id ? 'rgba(108,99,255,0.3)' : 'transparent',
                color: activeTab === id ? '#fff' : 'rgba(255,255,255,0.5)',
                fontFamily: 'Inter', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
              }}>{label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', padding: '10px 14px', fontSize: 13, fontFamily: 'Inter', cursor: 'pointer' }}>
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={() => setShowApplyModal(true)} className="btn btn-primary">
            + Apply Leave
          </button>
        </div>
      </div>

      {/* Leave Requests */}
      {activeTab === 'requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredLeaves.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📅</div><div className="empty-state-text">No leave requests found</div></div>
          ) : filteredLeaves.map(lv => {
            const emp = employees.find(e => e.id === lv.empId);
            const cfg = statusConfig[lv.status];
            return (
              <div key={lv.id} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: '20px 24px',
                display: 'flex', alignItems: 'center', gap: 16,
                transition: 'all 0.2s',
                borderLeft: `4px solid ${cfg.color}`,
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: '50%',
                  background: emp?.avatarColor || 'linear-gradient(135deg, #6c63ff, #00d4ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 17, fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>{emp ? getInitials(emp.name) : '?'}</div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>{lv.empName}</div>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>•</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.07)', padding: '2px 8px', borderRadius: 6 }}>{lv.type}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                    📅 {formatDate(lv.from)} → {formatDate(lv.to)}
                    <span style={{ marginLeft: 8, fontWeight: 700, color: '#fff' }}>({lv.days} {lv.days === 1 ? 'day' : 'days'})</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>📝 {lv.reason}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                    background: cfg.bg, color: cfg.color,
                    border: `1px solid ${cfg.color}40`,
                  }}>{cfg.icon} {cfg.label}</span>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'right' }}>
                    Applied {formatDate(lv.appliedOn)}
                  </div>
                </div>

                {lv.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => onUpdateLeave(lv.id, 'approved')}
                      style={{ padding: '7px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'rgba(0,230,118,0.15)', color: '#00e676', fontWeight: 700, fontSize: 13, fontFamily: 'Inter', transition: 'all 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,230,118,0.3)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,230,118,0.15)'}
                    >✅ Approve</button>
                    <button onClick={() => onUpdateLeave(lv.id, 'rejected')}
                      style={{ padding: '7px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'rgba(255,71,87,0.15)', color: '#ff4757', fontWeight: 700, fontSize: 13, fontFamily: 'Inter', transition: 'all 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,71,87,0.3)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,71,87,0.15)'}
                    >❌ Reject</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Leave Balance */}
      {activeTab === 'balance' && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Total Leaves</th>
                <th>Used</th>
                <th>Remaining</th>
                <th>Usage</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => {
                const total = emp.leaves?.total || 24;
                const used = emp.leaves?.used || 0;
                const remaining = emp.leaves?.remaining || 24;
                const pct = Math.round((used / total) * 100);
                return (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: emp.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                          {getInitials(emp.name)}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{emp.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{emp.department}</td>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{total}</td>
                    <td><span style={{ color: '#ff4757', fontWeight: 700 }}>{used}</span></td>
                    <td><span style={{ color: '#00e676', fontWeight: 700 }}>{remaining}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 80 }}>
                          <div className="progress-fill" style={{
                            width: `${pct}%`,
                            background: pct > 75 ? 'linear-gradient(90deg,#ff4757,#cc0015)' : pct > 50 ? 'linear-gradient(90deg,#ffa726,#f57c00)' : 'linear-gradient(90deg,#6c63ff,#00d4ff)',
                          }} />
                        </div>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Calendar view */}
      {activeTab === 'calendar' && (
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 20 }}>
            {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} — Leave Calendar
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', padding: '8px 0', fontWeight: 600 }}>{d}</div>
            ))}
            {(() => {
              const now = new Date();
              const year = now.getFullYear();
              const month = now.getMonth();
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const firstDay = new Date(year, month, 1).getDay();
              const cells = [];
              for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} />);
              for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const dayLeaves = leaves.filter(l => l.status === 'approved' && l.from <= dateStr && l.to >= dateStr);
                const isToday = day === now.getDate();
                const dow = new Date(dateStr).getDay();
                const isWeekend = dow === 0 || dow === 6;
                cells.push(
                  <div key={day} style={{
                    minHeight: 70, borderRadius: 10, padding: '6px 8px',
                    background: isToday ? 'rgba(108,99,255,0.2)' : isWeekend ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isToday ? 'rgba(108,99,255,0.5)' : 'rgba(255,255,255,0.06)'}`,
                    position: 'relative',
                  }}>
                    <div style={{ fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? '#6c63ff' : isWeekend ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)', marginBottom: 4 }}>{day}</div>
                    {dayLeaves.slice(0, 2).map((lv, i) => {
                      const emp = employees.find(e => e.id === lv.empId);
                      return (
                        <div key={i} style={{
                          fontSize: 9, padding: '2px 5px', borderRadius: 4, marginBottom: 2,
                          background: 'rgba(41,182,246,0.2)', color: '#29b6f6',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{emp?.name.split(' ')[0]}</div>
                      );
                    })}
                    {dayLeaves.length > 2 && (
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>+{dayLeaves.length - 2} more</div>
                    )}
                  </div>
                );
              }
              return cells;
            })()}
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <ApplyLeaveModal employees={employees} onAdd={(lv) => { onAddLeave(lv); setShowApplyModal(false); }} onClose={() => setShowApplyModal(false)} />
      )}
    </div>
  );
}

function ApplyLeaveModal({ employees, onAdd, onClose }) {
  const [form, setForm] = useState({ empId: employees[0]?.id || '', type: 'Casual Leave', from: '', to: '', reason: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const days = form.from && form.to ? Math.max(1, Math.ceil((new Date(form.to) - new Date(form.from)) / (1000 * 60 * 60 * 24)) + 1) : 0;
  const emp = employees.find(e => e.id === form.empId);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      id: 'LV' + Date.now(),
      empId: form.empId,
      empName: emp?.name || '',
      type: form.type,
      from: form.from,
      to: form.to,
      days,
      reason: form.reason,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>Apply for Leave</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Submit a new leave request</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', width: 36, height: 36, borderRadius: 10, cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Employee</label>
              <select className="select" value={form.empId} onChange={e => set('empId', e.target.value)}>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name} - {e.department}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Leave Type</label>
              <select className="select" value={form.type} onChange={e => set('type', e.target.value)}>
                {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">From Date</label>
                <input className="input" type="date" value={form.from} onChange={e => set('from', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">To Date</label>
                <input className="input" type="date" value={form.to} onChange={e => set('to', e.target.value)} required />
              </div>
            </div>
            {days > 0 && (
              <div style={{ padding: '10px 14px', background: 'rgba(108,99,255,0.1)', borderRadius: 10, border: '1px solid rgba(108,99,255,0.2)', fontSize: 13, color: '#8b85ff' }}>
                📅 Duration: <strong>{days} {days === 1 ? 'day' : 'days'}</strong>
                {emp && <span> • Balance: <strong>{emp.leaves?.remaining || 0} days remaining</strong></span>}
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Reason</label>
              <textarea className="textarea" rows={3} value={form.reason} onChange={e => set('reason', e.target.value)} placeholder="Reason for leave..." required />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!form.from || !form.to}>📅 Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  );
}
