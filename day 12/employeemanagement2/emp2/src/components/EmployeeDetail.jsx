import React, { useState } from 'react';
import { getInitials, formatCurrency, formatDate, getYearsOfService, calculateSalaryBreakdown } from '../utils/helpers';
import SalarySlip from './SalarySlip';

// Local attendance stats calculator
function calculateAttendanceStats(attendance, empId, year, month) {
  let present = 0, late = 0, absent = 0, leave = 0;
  Object.entries(attendance).forEach(([date, records]) => {
    const d = new Date(date);
    if (d.getFullYear() === year && d.getMonth() + 1 === month) {
      const status = records[empId];
      if (status === 'present') present++;
      else if (status === 'late') late++;
      else if (status === 'absent') absent++;
      else if (status === 'leave') leave++;
    }
  });
  const total = present + late + absent + leave;
  const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
  return { present, late, absent, leave, total, percentage };
}

const DEPT_COLORS = {
  Engineering: '#6c63ff', Design: '#00d4ff', Marketing: '#ffa726',
  Sales: '#00e676', HR: '#ab47bc', Finance: '#ff4757', Operations: '#26c6da', Legal: '#ff7043',
};

export default function EmployeeDetail({ employee, attendance, leaves, onBack, onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showSlip, setShowSlip] = useState(false);

  if (!employee) return (
    <div className="empty-state">
      <div className="empty-state-icon">👤</div>
      <div className="empty-state-text">No employee selected</div>
    </div>
  );

  const now = new Date();
  const stats = calculateAttendanceStats(attendance, employee.id, now.getFullYear(), now.getMonth() + 1);
  const empLeaves = leaves.filter(l => l.empId === employee.id);
  const deptColor = DEPT_COLORS[employee.department] || '#6c63ff';
  const salary = calculateSalaryBreakdown(employee.salary);

  const tabs = [
    { id: 'overview', label: '👤 Overview', icon: '👤' },
    { id: 'attendance', label: '⏰ Attendance', icon: '⏰' },
    { id: 'salary', label: '💰 Salary', icon: '💰' },
    { id: 'leaves', label: '📅 Leaves', icon: '📅' },
    { id: 'documents', label: '📄 Documents', icon: '📄' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Back button */}
      <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }}>
        ← Back to Employees
      </button>

      {/* Profile header */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 24,
        position: 'relative',
      }}>
        {/* Banner */}
        <div style={{
          height: 120,
          background: `linear-gradient(135deg, ${deptColor}33, ${deptColor}11, rgba(0,212,255,0.1))`,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)',
          }} />
        </div>

        <div style={{ padding: '0 32px 28px', position: 'relative' }}>
          {/* Avatar */}
          <div style={{
            width: 96, height: 96, borderRadius: 24,
            background: employee.avatarColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, fontWeight: 700, color: '#fff',
            border: '4px solid #0d0f2b',
            position: 'absolute',
            top: -48, left: 32,
            boxShadow: `0 8px 30px ${deptColor}44`,
          }}>{getInitials(employee.name)}</div>

          <div style={{ paddingTop: 60, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{employee.name}</div>
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>{employee.role}</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: `${deptColor}1a`, color: deptColor }}>
                  {employee.department}
                </span>
                <span className={`badge badge-${employee.status === 'active' ? 'success' : employee.status === 'on-leave' ? 'warning' : 'danger'}`}>
                  ● {employee.status === 'active' ? 'Active' : employee.status === 'on-leave' ? 'On Leave' : 'Inactive'}
                </span>
                <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}>
                  📍 {employee.location}
                </span>
                <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontFamily: 'monospace', background: 'rgba(108,99,255,0.1)', color: '#6c63ff' }}>
                  {employee.id}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('video-call', employee)}>📹 Video Call</button>
              <button className="btn btn-primary btn-sm" onClick={() => setShowSlip(true)}>💰 Salary Slip</button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick info row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: '📧', label: 'Email', value: employee.email },
          { icon: '📞', label: 'Phone', value: employee.phone },
          { icon: '👤', label: 'Manager', value: employee.manager || 'N/A' },
          { icon: '📅', label: 'Tenure', value: getYearsOfService(employee.joinDate) },
        ].map((item, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: '14px 16px',
          }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{item.icon}</span>{item.label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', wordBreak: 'break-all' }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, padding: '10px 0', border: 'none', borderRadius: 10,
              cursor: 'pointer', fontFamily: 'Inter', fontSize: 13, fontWeight: 600,
              background: activeTab === tab.id ? 'rgba(108,99,255,0.3)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.45)',
              transition: 'all 0.2s',
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          <div>
            {employee.about && (
              <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 12 }}>About</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{employee.about}</div>
              </div>
            )}
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 16 }}>Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(employee.skills || []).map(skill => (
                  <span key={skill} style={{
                    padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                    background: 'rgba(108,99,255,0.12)', color: '#8b85ff',
                    border: '1px solid rgba(108,99,255,0.2)',
                  }}>{skill}</span>
                ))}
                {(!employee.skills || employee.skills.length === 0) && (
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No skills listed</span>
                )}
              </div>
            </div>
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 16 }}>Personal Details</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Join Date', value: formatDate(employee.joinDate) },
                  { label: 'Education', value: employee.education || 'N/A' },
                  { label: 'Address', value: employee.address || 'N/A' },
                  { label: 'Emergency Contact', value: employee.emergencyContact?.name ? `${employee.emergencyContact.name} (${employee.emergencyContact.relation})` : 'N/A' },
                ].map((item, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side */}
          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 16 }}>Performance</div>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{
                  width: 100, height: 100, borderRadius: '50%', margin: '0 auto 12px',
                  background: `conic-gradient(${employee.performance >= 90 ? '#00e676' : '#ffa726'} ${employee.performance * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <div style={{
                    width: 76, height: 76, borderRadius: '50%',
                    background: '#111230', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, fontWeight: 800, color: employee.performance >= 90 ? '#00e676' : '#ffa726',
                  }}>{employee.performance}%</div>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                  {employee.performance >= 90 ? '⭐ Excellent' : employee.performance >= 80 ? '👍 Good' : '⚡ Average'}
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 16 }}>This Month</div>
              {[
                { label: 'Present', value: stats.present, color: '#00e676' },
                { label: 'Late', value: stats.late, color: '#ffa726' },
                { label: 'Absent', value: stats.absent, color: '#ff4757' },
                { label: 'On Leave', value: stats.leave, color: '#29b6f6' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.value} days</span>
                </div>
              ))}
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
                  <span>Attendance Rate</span><span style={{ color: '#00e676', fontWeight: 700 }}>{stats.percentage}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${stats.percentage}%`, background: 'linear-gradient(90deg, #6c63ff, #00d4ff)' }} />
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 16 }}>Leave Balance</div>
              {[
                { label: 'Total', value: employee.leaves?.total || 24, color: '#6c63ff' },
                { label: 'Used', value: employee.leaves?.used || 0, color: '#ff4757' },
                { label: 'Remaining', value: employee.leaves?.remaining || 24, color: '#00e676' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Attendance */}
      {activeTab === 'attendance' && (
        <AttendanceTab employee={employee} attendance={attendance} />
      )}

      {/* Tab: Salary */}
      {activeTab === 'salary' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>Salary Breakdown</div>
            <button className="btn btn-primary" onClick={() => setShowSlip(true)}>📄 View Salary Slip</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#00e676', marginBottom: 12 }}>💚 Earnings</div>
              {Object.entries(salary.earnings).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>{k === 'hra' ? 'HRA' : k === 'da' ? 'DA' : k === 'ta' ? 'TA' : k}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{formatCurrency(v)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px solid rgba(0,230,118,0.2)' }}>
                <span style={{ fontWeight: 700, color: '#00e676' }}>Gross Salary</span>
                <span style={{ fontWeight: 800, color: '#00e676', fontSize: 16 }}>{formatCurrency(salary.grossSalary)}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#ff4757', marginBottom: 12 }}>❤️ Deductions</div>
              {Object.entries(salary.deductions).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                    {k === 'pf' ? 'Provident Fund' : k === 'professionalTax' ? 'Professional Tax' : 'Income Tax'}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#ff4757' }}>{formatCurrency(v)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px solid rgba(255,71,87,0.2)' }}>
                <span style={{ fontWeight: 700, color: '#ff4757' }}>Total Deductions</span>
                <span style={{ fontWeight: 800, color: '#ff4757', fontSize: 16 }}>{formatCurrency(salary.totalDeductions)}</span>
              </div>
            </div>
          </div>
          <div style={{
            marginTop: 20, padding: '20px 24px',
            background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(0,212,255,0.08))',
            borderRadius: 16, border: '1px solid rgba(108,99,255,0.2)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Net Take-Home Salary</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#fff' }}>{formatCurrency(salary.netSalary)}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Per month after deductions</div>
            </div>
            <div style={{ fontSize: 48 }}>💰</div>
          </div>
        </div>
      )}

      {/* Tab: Leaves */}
      {activeTab === 'leaves' && (
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 20 }}>Leave History</div>
          {empLeaves.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <div className="empty-state-text">No leave records found</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th></tr></thead>
                <tbody>
                  {empLeaves.map(lv => (
                    <tr key={lv.id}>
                      <td>{lv.type}</td>
                      <td>{formatDate(lv.from)}</td>
                      <td>{formatDate(lv.to)}</td>
                      <td><strong>{lv.days}</strong></td>
                      <td>{lv.reason}</td>
                      <td>
                        <span className={`badge badge-${lv.status === 'approved' ? 'success' : lv.status === 'pending' ? 'warning' : 'danger'}`}>
                          {lv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Documents */}
      {activeTab === 'documents' && (
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 20 }}>Documents</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {['Offer Letter', 'Appointment Letter', 'ID Card', 'PAN Card', 'Aadhaar', 'Bank Details'].map(doc => (
              <div key={doc} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '16px', display: 'flex', gap: 12, alignItems: 'center',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <span style={{ fontSize: 28 }}>📄</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{doc}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>PDF • Verified</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Salary Slip modal */}
      {showSlip && (
        <SalarySlip employee={employee} onClose={() => setShowSlip(false)} />
      )}
    </div>
  );
}

function AttendanceTab({ employee, attendance }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();

  const getStatus = (day) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayOfWeek = new Date(dateStr).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return 'weekend';
    if (new Date(dateStr) > now) return 'future';
    return attendance[dateStr]?.[employee.id] || 'absent';
  };

  const statusConfig = {
    present: { color: '#00e676', label: 'Present', bg: 'rgba(0,230,118,0.15)' },
    late: { color: '#ffa726', label: 'Late', bg: 'rgba(255,167,38,0.15)' },
    absent: { color: '#ff4757', label: 'Absent', bg: 'rgba(255,71,87,0.15)' },
    leave: { color: '#29b6f6', label: 'Leave', bg: 'rgba(41,182,246,0.15)' },
    weekend: { color: 'rgba(255,255,255,0.1)', label: 'Weekend', bg: 'rgba(255,255,255,0.03)' },
    future: { color: 'rgba(255,255,255,0.05)', label: '', bg: 'transparent' },
  };

  const stats = calculateAttendanceStats(attendance, employee.id, year, month);

  return (
    <div className="card">
      <div style={{ fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 16 }}>
        {now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} Attendance
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {Object.entries({ Present: { v: stats.present, c: '#00e676' }, Late: { v: stats.late, c: '#ffa726' }, Absent: { v: stats.absent, c: '#ff4757' }, Leave: { v: stats.leave, c: '#29b6f6' } }).map(([k, obj]) => (
          <div key={k} style={{ flex: 1, background: `${obj.c}0f`, border: `1px solid ${obj.c}22`, borderRadius: 12, padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: obj.c }}>{obj.v}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{k}</div>
          </div>
        ))}
        <div style={{ flex: 1, background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#6c63ff' }}>{stats.percentage}%</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Rate</div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        {Object.entries(statusConfig).filter(([k]) => k !== 'future').map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: v.color }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{v.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', padding: '4px 0' }}>{d}</div>
          ))}
        </div>
        {/* First day offset */}
        {(() => {
          const firstDay = new Date(year, month - 1, 1).getDay();
          const cells = [];
          for (let i = 0; i < firstDay; i++) cells.push(<div key={`empty-${i}`} />);
          for (let day = 1; day <= daysInMonth; day++) {
            const status = getStatus(day);
            const cfg = statusConfig[status] || statusConfig.absent;
            cells.push(
              <div key={day} style={{
                aspectRatio: '1',
                background: cfg.bg,
                border: `1px solid ${status === 'future' ? 'transparent' : cfg.color + '33'}`,
                borderRadius: 8,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 600,
                color: status === 'weekend' || status === 'future' ? 'rgba(255,255,255,0.2)' : cfg.color,
              }}>
                {day}
              </div>
            );
          }
          return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>{cells}</div>;
        })()}
      </div>
    </div>
  );
}


