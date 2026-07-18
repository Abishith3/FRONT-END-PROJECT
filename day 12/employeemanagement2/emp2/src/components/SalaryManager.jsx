import React, { useState } from 'react';
import { formatCurrency, calculateSalaryBreakdown, getInitials } from '../utils/helpers';
import SalarySlip from './SalarySlip';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function SalaryManager({ employees }) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [showSlip, setShowSlip] = useState(false);
  const [filterDept, setFilterDept] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [processed, setProcessed] = useState(false);

  const departments = ['All', ...new Set(employees.map(e => e.department))];

  let filtered = filterDept === 'All' ? employees : employees.filter(e => e.department === filterDept);
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'salary-high') return b.salary - a.salary;
    if (sortBy === 'salary-low') return a.salary - b.salary;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const totalPayroll = filtered.reduce((s, e) => s + e.salary, 0);
  const avgSalary = filtered.length > 0 ? Math.round(totalPayroll / filtered.length) : 0;
  const maxSalary = Math.max(...filtered.map(e => e.salary));
  const minSalary = Math.min(...filtered.map(e => e.salary));

  const deptPayroll = {};
  employees.forEach(e => {
    deptPayroll[e.department] = (deptPayroll[e.department] || 0) + e.salary;
  });

  return (
    <div className="animate-fade-in">
      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={selectedMonth} onChange={e => setSelectedMonth(+e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', padding: '10px 14px', fontSize: 13, fontFamily: 'Inter', cursor: 'pointer' }}>
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={selectedYear} onChange={e => setSelectedYear(+e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', padding: '10px 14px', fontSize: 13, fontFamily: 'Inter', cursor: 'pointer' }}>
          {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', padding: '10px 14px', fontSize: 13, fontFamily: 'Inter', cursor: 'pointer' }}>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', padding: '10px 14px', fontSize: 13, fontFamily: 'Inter', cursor: 'pointer' }}>
          <option value="name">Sort: Name</option>
          <option value="salary-high">Sort: High Salary</option>
          <option value="salary-low">Sort: Low Salary</option>
        </select>
        <button
          onClick={() => setProcessed(true)}
          className={`btn ${processed ? 'btn-success' : 'btn-primary'}`}
          style={{ marginLeft: 'auto' }}
        >
          {processed ? '✅ Payroll Processed' : '⚡ Process Payroll'}
        </button>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Payroll', value: formatCurrency(totalPayroll), color: '#6c63ff', icon: '💰', bg: 'rgba(108,99,255,0.08)' },
          { label: 'Average Salary', value: formatCurrency(avgSalary), color: '#00d4ff', icon: '📊', bg: 'rgba(0,212,255,0.08)' },
          { label: 'Highest CTC', value: formatCurrency(maxSalary), color: '#00e676', icon: '⬆️', bg: 'rgba(0,230,118,0.08)' },
          { label: 'Lowest CTC', value: formatCurrency(minSalary), color: '#ffa726', icon: '⬇️', bg: 'rgba(255,167,38,0.08)' },
        ].map((item, i) => (
          <div key={i} style={{
            background: item.bg, border: `1px solid ${item.color}22`,
            borderRadius: 16, padding: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{item.label}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: item.color }}>{item.value}</div>
              </div>
              <span style={{ fontSize: 28 }}>{item.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dept Payroll breakdown */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 20 }}>Payroll by Department</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(deptPayroll).sort(([,a],[,b]) => b-a).map(([dept, amount]) => {
            const pct = Math.round((amount / totalPayroll) * 100);
            return (
              <div key={dept}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{dept}</span>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{pct}%</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{formatCurrency(amount)}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6c63ff, #00d4ff)' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payroll table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>
            Payroll - {MONTHS[selectedMonth - 1]} {selectedYear}
          </div>
          {processed && (
            <span className="badge badge-success">✅ Processed</span>
          )}
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Gross Salary</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => {
                const breakdown = calculateSalaryBreakdown(emp.salary);
                return (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: emp.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
                          {getInitials(emp.name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff', fontSize: 13 }}>{emp.name}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{emp.role}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{emp.department}</td>
                    <td style={{ fontWeight: 600, color: '#00e676', fontSize: 13 }}>{formatCurrency(breakdown.grossSalary)}</td>
                    <td style={{ fontWeight: 600, color: '#ff4757', fontSize: 13 }}>-{formatCurrency(breakdown.totalDeductions)}</td>
                    <td style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>{formatCurrency(breakdown.netSalary)}</td>
                    <td>
                      <span className={`badge ${processed ? 'badge-success' : 'badge-warning'}`}>
                        {processed ? '✅ Paid' : '⏳ Pending'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => { setSelectedEmp(emp); setShowSlip(true); }}
                        style={{
                          padding: '5px 12px', borderRadius: 8, border: '1px solid rgba(108,99,255,0.3)',
                          background: 'rgba(108,99,255,0.1)', color: '#8b85ff', cursor: 'pointer',
                          fontSize: 12, fontWeight: 600, fontFamily: 'Inter', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.25)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(108,99,255,0.1)'}
                      >📄 Slip</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: 'rgba(108,99,255,0.08)', borderTop: '2px solid rgba(108,99,255,0.2)' }}>
                <td colSpan={2} style={{ fontWeight: 800, color: '#fff', padding: '14px 16px' }}>Total ({filtered.length} employees)</td>
                <td style={{ fontWeight: 800, color: '#00e676', padding: '14px 16px', fontSize: 14 }}>
                  {formatCurrency(filtered.reduce((s, e) => s + calculateSalaryBreakdown(e.salary).grossSalary, 0))}
                </td>
                <td style={{ fontWeight: 800, color: '#ff4757', padding: '14px 16px', fontSize: 14 }}>
                  -{formatCurrency(filtered.reduce((s, e) => s + calculateSalaryBreakdown(e.salary).totalDeductions, 0))}
                </td>
                <td style={{ fontWeight: 900, color: '#fff', padding: '14px 16px', fontSize: 16 }}>
                  {formatCurrency(filtered.reduce((s, e) => s + calculateSalaryBreakdown(e.salary).netSalary, 0))}
                </td>
                <td /><td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {showSlip && selectedEmp && (
        <SalarySlip employee={selectedEmp} month={selectedMonth} year={selectedYear} onClose={() => { setShowSlip(false); setSelectedEmp(null); }} />
      )}
    </div>
  );
}
