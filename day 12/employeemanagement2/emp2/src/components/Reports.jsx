import React, { useState } from 'react';
import { formatCurrency, getInitials, calculateSalaryBreakdown, getWorkingDaysInMonth } from '../utils/helpers';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Reports({ employees, attendance, leaves }) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [activeReport, setActiveReport] = useState('overview');

  // Compute stats for selected month
  const workingDays = getWorkingDaysInMonth(selectedYear, selectedMonth);
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

  const getAttendance = (empId) => {
    let present = 0, late = 0, absent = 0, leaveCount = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      if (new Date(dateStr) > now) continue;
      const dow = new Date(dateStr).getDay();
      if (dow === 0 || dow === 6) continue;
      const s = attendance[dateStr]?.[empId];
      if (s === 'present') present++;
      else if (s === 'late') late++;
      else if (s === 'absent') absent++;
      else if (s === 'leave') leaveCount++;
    }
    const markedDays = present + late + absent + leaveCount;
    const pct = markedDays > 0 ? Math.round(((present + late) / markedDays) * 100) : 0;
    return { present, late, absent, leaveCount, pct };
  };

  const monthLeaves = leaves.filter(l => {
    const from = new Date(l.from);
    return from.getMonth() + 1 === selectedMonth && from.getFullYear() === selectedYear;
  });

  const totalPayroll = employees.reduce((s, e) => s + calculateSalaryBreakdown(e.salary).netSalary, 0);
  const deptStats = {};
  employees.forEach(e => {
    if (!deptStats[e.department]) deptStats[e.department] = { count: 0, salary: 0, performance: 0 };
    deptStats[e.department].count++;
    deptStats[e.department].salary += e.salary;
    deptStats[e.department].performance += e.performance;
  });

  const reports = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'attendance', label: '⏰ Attendance', icon: '⏰' },
    { id: 'payroll', label: '💰 Payroll', icon: '💰' },
    { id: 'leaves', label: '📅 Leaves', icon: '📅' },
    { id: 'performance', label: '🏆 Performance', icon: '🏆' },
    { id: 'headcount', label: '👥 Headcount', icon: '👥' },
  ];

  const handleExport = () => {
    let csv = '';
    if (activeReport === 'attendance') {
      csv = 'Employee,Department,Present,Late,Absent,Leave,Attendance %\n';
      employees.forEach(emp => {
        const att = getAttendance(emp.id);
        csv += `${emp.name},${emp.department},${att.present},${att.late},${att.absent},${att.leaveCount},${att.pct}%\n`;
      });
    } else if (activeReport === 'payroll') {
      csv = 'Employee,Department,Role,Gross Salary,Deductions,Net Salary\n';
      employees.forEach(emp => {
        const b = calculateSalaryBreakdown(emp.salary);
        csv += `${emp.name},${emp.department},${emp.role},${b.grossSalary},${b.totalDeductions},${b.netSalary}\n`;
      });
    } else {
      csv = 'Employee,ID,Department,Role,Salary,Performance,Status\n';
      employees.forEach(emp => {
        csv += `${emp.name},${emp.id},${emp.department},${emp.role},${emp.salary},${emp.performance}%,${emp.status}\n`;
      });
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `${activeReport}_report_${MONTHS[selectedMonth-1]}_${selectedYear}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={selectedMonth} onChange={e => setSelectedMonth(+e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', padding: '10px 14px', fontSize: 13, fontFamily: 'Inter', cursor: 'pointer' }}>
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={selectedYear} onChange={e => setSelectedYear(+e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', padding: '10px 14px', fontSize: 13, fontFamily: 'Inter', cursor: 'pointer' }}>
          {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <button onClick={handleExport} className="btn btn-accent" style={{ marginLeft: 'auto' }}>
          ⬇️ Export CSV
        </button>
      </div>

      {/* Report tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap' }}>
        {reports.map(r => (
          <button key={r.id} onClick={() => setActiveReport(r.id)}
            style={{
              flex: 1, minWidth: 100, padding: '10px 8px', border: 'none', borderRadius: 10,
              cursor: 'pointer', fontFamily: 'Inter', fontSize: 12, fontWeight: 600,
              background: activeReport === r.id ? 'rgba(108,99,255,0.3)' : 'transparent',
              color: activeReport === r.id ? '#fff' : 'rgba(255,255,255,0.45)',
              transition: 'all 0.2s',
            }}>{r.label}</button>
        ))}
      </div>

      {/* Overview */}
      {activeReport === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Total Employees', value: employees.length, icon: '👥', color: '#6c63ff' },
              { label: 'Total Payroll', value: formatCurrency(totalPayroll), icon: '💰', color: '#00e676' },
              { label: 'Avg Performance', value: `${Math.round(employees.reduce((s, e) => s + e.performance, 0) / employees.length)}%`, icon: '📈', color: '#ffa726' },
              { label: 'Leave Requests', value: monthLeaves.length, icon: '📅', color: '#00d4ff' },
            ].map((item, i) => (
              <div key={i} style={{
                background: `${item.color}0d`, border: `1px solid ${item.color}22`,
                borderRadius: 16, padding: '20px', display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <span style={{ fontSize: 32 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: item.color }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Department breakdown table */}
          <div className="card">
            <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 20 }}>Department Summary</div>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Department</th><th>Employees</th><th>Total Salary</th><th>Avg Salary</th><th>Avg Performance</th></tr></thead>
                <tbody>
                  {Object.entries(deptStats).sort(([,a],[,b]) => b.count - a.count).map(([dept, stats]) => (
                    <tr key={dept}>
                      <td style={{ fontWeight: 600, color: '#fff' }}>{dept}</td>
                      <td><span style={{ fontWeight: 700, color: '#6c63ff' }}>{stats.count}</span></td>
                      <td style={{ color: '#00e676', fontWeight: 600 }}>{formatCurrency(stats.salary)}</td>
                      <td style={{ color: '#fff' }}>{formatCurrency(Math.round(stats.salary / stats.count))}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-bar" style={{ width: 80 }}>
                            <div className="progress-fill" style={{ width: `${Math.round(stats.performance / stats.count)}%`, background: 'linear-gradient(90deg, #6c63ff, #00d4ff)' }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{Math.round(stats.performance / stats.count)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Report */}
      {activeReport === 'attendance' && (
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 8 }}>Attendance Report — {MONTHS[selectedMonth - 1]} {selectedYear}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Working days this month: <strong style={{ color: '#fff' }}>{workingDays}</strong></div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Employee</th><th>Dept</th><th>Present</th><th>Late</th><th>Absent</th><th>Leave</th><th>Attendance %</th><th>Status</th></tr></thead>
              <tbody>
                {employees.map(emp => {
                  const att = getAttendance(emp.id);
                  return (
                    <tr key={emp.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: emp.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                            {getInitials(emp.name)}
                          </div>
                          <span style={{ fontWeight: 600, color: '#fff', fontSize: 13 }}>{emp.name}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{emp.department}</td>
                      <td><span style={{ color: '#00e676', fontWeight: 700 }}>{att.present}</span></td>
                      <td><span style={{ color: '#ffa726', fontWeight: 700 }}>{att.late}</span></td>
                      <td><span style={{ color: '#ff4757', fontWeight: 700 }}>{att.absent}</span></td>
                      <td><span style={{ color: '#29b6f6', fontWeight: 700 }}>{att.leaveCount}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-bar" style={{ width: 70 }}>
                            <div className="progress-fill" style={{ width: `${att.pct}%`, background: att.pct >= 85 ? 'linear-gradient(90deg,#00e676,#00b050)' : att.pct >= 70 ? 'linear-gradient(90deg,#ffa726,#f57c00)' : 'linear-gradient(90deg,#ff4757,#cc0015)' }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: att.pct >= 85 ? '#00e676' : att.pct >= 70 ? '#ffa726' : '#ff4757' }}>{att.pct}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${att.pct >= 85 ? 'success' : att.pct >= 70 ? 'warning' : 'danger'}`}>
                          {att.pct >= 85 ? 'Good' : att.pct >= 70 ? 'Fair' : 'Poor'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payroll Report */}
      {activeReport === 'payroll' && (
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 20 }}>Payroll Report — {MONTHS[selectedMonth - 1]} {selectedYear}</div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Employee</th><th>Dept</th><th>Role</th><th>Basic</th><th>HRA</th><th>Gross</th><th>Deductions</th><th>Net Pay</th></tr></thead>
              <tbody>
                {employees.map(emp => {
                  const b = calculateSalaryBreakdown(emp.salary);
                  return (
                    <tr key={emp.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: emp.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{getInitials(emp.name)}</div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#fff', fontSize: 13 }}>{emp.name}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{emp.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{emp.department}</td>
                      <td style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{emp.role}</td>
                      <td style={{ color: '#fff', fontWeight: 600, fontSize: 12 }}>{formatCurrency(b.earnings.basic)}</td>
                      <td style={{ color: '#fff', fontWeight: 600, fontSize: 12 }}>{formatCurrency(b.earnings.hra)}</td>
                      <td style={{ color: '#00e676', fontWeight: 700 }}>{formatCurrency(b.grossSalary)}</td>
                      <td style={{ color: '#ff4757', fontWeight: 700 }}>-{formatCurrency(b.totalDeductions)}</td>
                      <td style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>{formatCurrency(b.netSalary)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: 'rgba(108,99,255,0.08)', borderTop: '2px solid rgba(108,99,255,0.2)' }}>
                  <td colSpan={5} style={{ fontWeight: 800, color: '#fff', padding: '14px 16px' }}>TOTAL ({employees.length} employees)</td>
                  <td style={{ fontWeight: 800, color: '#00e676', padding: '14px 16px' }}>{formatCurrency(employees.reduce((s, e) => s + calculateSalaryBreakdown(e.salary).grossSalary, 0))}</td>
                  <td style={{ fontWeight: 800, color: '#ff4757', padding: '14px 16px' }}>-{formatCurrency(employees.reduce((s, e) => s + calculateSalaryBreakdown(e.salary).totalDeductions, 0))}</td>
                  <td style={{ fontWeight: 900, color: '#fff', padding: '14px 16px', fontSize: 15 }}>{formatCurrency(employees.reduce((s, e) => s + calculateSalaryBreakdown(e.salary).netSalary, 0))}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Leaves Report */}
      {activeReport === 'leaves' && (
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 20 }}>Leave Report — {MONTHS[selectedMonth - 1]} {selectedYear}</div>
          {monthLeaves.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📅</div><div className="empty-state-text">No leave records for this period</div></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th></tr></thead>
                <tbody>
                  {monthLeaves.map(lv => (
                    <tr key={lv.id}>
                      <td style={{ fontWeight: 600, color: '#fff' }}>{lv.empName}</td>
                      <td style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{lv.type}</td>
                      <td style={{ fontSize: 12 }}>{new Date(lv.from).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</td>
                      <td style={{ fontSize: 12 }}>{new Date(lv.to).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</td>
                      <td><strong style={{ color: '#fff' }}>{lv.days}</strong></td>
                      <td style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', maxWidth: 200 }}>{lv.reason}</td>
                      <td><span className={`badge badge-${lv.status === 'approved' ? 'success' : lv.status === 'pending' ? 'warning' : 'danger'}`}>{lv.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Performance Report */}
      {activeReport === 'performance' && (
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 20 }}>Performance Rankings</div>
          {[...employees].sort((a, b) => b.performance - a.performance).map((emp, i) => (
            <div key={emp.id} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '14px 0', borderBottom: i < employees.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: i === 0 ? 'linear-gradient(135deg, #ffd700, #ffa500)' : i === 1 ? 'linear-gradient(135deg, #c0c0c0, #a0a0a0)' : i === 2 ? 'linear-gradient(135deg, #cd7f32, #a0522d)' : 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, color: '#fff',
              }}>{i + 1}</div>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: emp.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {getInitials(emp.name)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{emp.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{emp.role} • {emp.department}</div>
              </div>
              <div style={{ width: 200 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Performance</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: emp.performance >= 90 ? '#00e676' : '#ffa726' }}>{emp.performance}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${emp.performance}%`,
                    background: emp.performance >= 90 ? 'linear-gradient(90deg, #00e676, #00b050)' : 'linear-gradient(90deg, #ffa726, #f57c00)',
                  }} />
                </div>
              </div>
              <span className={`badge badge-${emp.performance >= 90 ? 'success' : emp.performance >= 80 ? 'info' : 'warning'}`}>
                {emp.performance >= 90 ? '⭐ Excellent' : emp.performance >= 80 ? '👍 Good' : '⚡ Average'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Headcount Report */}
      {activeReport === 'headcount' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 20 }}>By Department</div>
              {Object.entries(deptStats).sort(([,a],[,b]) => b.count - a.count).map(([dept, stats]) => {
                const pct = Math.round((stats.count / employees.length) * 100);
                return (
                  <div key={dept} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{dept}</span>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{pct}%</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{stats.count} people</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6c63ff, #00d4ff)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 20 }}>By Status</div>
              {[
                { label: 'Active', value: employees.filter(e => e.status === 'active').length, color: '#00e676', icon: '✅' },
                { label: 'On Leave', value: employees.filter(e => e.status === 'on-leave').length, color: '#ffa726', icon: '🏖️' },
                { label: 'Inactive', value: employees.filter(e => e.status === 'inactive').length, color: '#ff4757', icon: '❌' },
              ].map((item, i) => {
                const pct = Math.round((item.value / employees.length) * 100);
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16,
                    padding: '14px 16px', background: `${item.color}0d`,
                    border: `1px solid ${item.color}22`, borderRadius: 12,
                  }}>
                    <span style={{ fontSize: 24 }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{item.label}</span>
                        <span style={{ fontWeight: 800, color: item.color, fontSize: 16 }}>{item.value}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: item.color }} />
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{pct}%</div>
                  </div>
                );
              })}
              <div style={{ marginTop: 16, padding: '14px', background: 'rgba(108,99,255,0.08)', borderRadius: 12, border: '1px solid rgba(108,99,255,0.2)', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>TOTAL HEADCOUNT</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#fff' }}>{employees.length}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
