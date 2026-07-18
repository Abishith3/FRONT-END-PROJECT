import React, { useState } from 'react';
import { getAttendanceColor, getWorkingDaysInMonth, formatCurrency } from '../utils/helpers';

const STATUS_OPTIONS = ['present', 'late', 'absent', 'leave'];
const STATUS_LABELS = { present: 'Present', late: 'Late', absent: 'Absent', leave: 'Leave' };
const STATUS_ICONS = { present: '✅', late: '⏰', absent: '❌', leave: '🏖️' };

export default function AttendanceManager({ employees, attendance, onUpdateAttendance }) {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(now.toISOString().split('T')[0]);
  const [filterDept, setFilterDept] = useState('All');
  const [view, setView] = useState('daily'); // 'daily' | 'monthly'
  const [bulkStatus, setBulkStatus] = useState('present');

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const departments = ['All', ...new Set(employees.map(e => e.department))];

  const filteredEmployees = filterDept === 'All' ? employees : employees.filter(e => e.department === filterDept);

  const getStatus = (empId, date) => attendance[date]?.[empId] || null;

  const handleMark = (empId, date, status) => {
    onUpdateAttendance(date, empId, status);
  };

  const handleMarkAll = (date, status) => {
    filteredEmployees.forEach(emp => onUpdateAttendance(date, emp.id, status));
  };

  // Monthly summary per employee
  const getMonthlyStats = (empId) => {
    let present = 0, late = 0, absent = 0, leave = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayOfWeek = new Date(dateStr).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      if (new Date(dateStr) > now) continue;
      const s = attendance[dateStr]?.[empId];
      if (s === 'present') present++;
      else if (s === 'late') late++;
      else if (s === 'absent') absent++;
      else if (s === 'leave') leave++;
    }
    const total = present + late + absent + leave;
    const pct = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    return { present, late, absent, leave, total, pct };
  };

  // Today's summary
  const todayRecords = attendance[selectedDate] || {};
  const presentCount = Object.values(todayRecords).filter(v => v === 'present').length;
  const lateCount = Object.values(todayRecords).filter(v => v === 'late').length;
  const absentCount = Object.values(todayRecords).filter(v => v === 'absent').length;
  const leaveCount = Object.values(todayRecords).filter(v => v === 'leave').length;

  const workingDays = getWorkingDaysInMonth(selectedYear, selectedMonth);

  return (
    <div className="animate-fade-in">
      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* View toggle */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
          {[['daily', '📅 Daily'], ['monthly', '📊 Monthly']].map(([v, l]) => (
            <button key={v} onClick={() => setView(v)}
              style={{
                padding: '10px 20px', border: 'none', cursor: 'pointer',
                background: view === v ? 'rgba(108,99,255,0.3)' : 'transparent',
                color: view === v ? '#fff' : 'rgba(255,255,255,0.5)',
                fontFamily: 'Inter', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
              }}>{l}</button>
          ))}
        </div>

        {view === 'daily' ? (
          <input type="date" value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            max={now.toISOString().split('T')[0]}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', padding: '10px 14px', fontSize: 13, fontFamily: 'Inter', cursor: 'pointer' }} />
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <select value={selectedMonth} onChange={e => setSelectedMonth(+e.target.value)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', padding: '10px 14px', fontSize: 13, fontFamily: 'Inter', cursor: 'pointer' }}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{new Date(2024, i, 1).toLocaleString('en', { month: 'long' })}</option>
              ))}
            </select>
            <select value={selectedYear} onChange={e => setSelectedYear(+e.target.value)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', padding: '10px 14px', fontSize: 13, fontFamily: 'Inter', cursor: 'pointer' }}>
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        )}

        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', padding: '10px 14px', fontSize: 13, fontFamily: 'Inter', cursor: 'pointer' }}>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        {view === 'daily' && (
          <>
            <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', padding: '10px 14px', fontSize: 13, fontFamily: 'Inter', cursor: 'pointer' }}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
            <button onClick={() => handleMarkAll(selectedDate, bulkStatus)} className="btn btn-primary btn-sm">
              Mark All {STATUS_LABELS[bulkStatus]}
            </button>
          </>
        )}
      </div>

      {/* Stats row (daily view) */}
      {view === 'daily' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Present', value: presentCount, color: '#00e676', bg: 'rgba(0,230,118,0.08)', icon: '✅' },
            { label: 'Late', value: lateCount, color: '#ffa726', bg: 'rgba(255,167,38,0.08)', icon: '⏰' },
            { label: 'Absent', value: absentCount, color: '#ff4757', bg: 'rgba(255,71,87,0.08)', icon: '❌' },
            { label: 'On Leave', value: leaveCount, color: '#29b6f6', bg: 'rgba(41,182,246,0.08)', icon: '🏖️' },
            { label: 'Attendance %', value: `${employees.length > 0 ? Math.round(((presentCount + lateCount) / employees.length) * 100) : 0}%`, color: '#6c63ff', bg: 'rgba(108,99,255,0.08)', icon: '📊' },
          ].map((item, i) => (
            <div key={i} style={{
              background: item.bg, border: `1px solid ${item.color}22`,
              borderRadius: 14, padding: '16px 18px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: item.color }}>{item.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{item.label}</div>
              </div>
              <span style={{ fontSize: 28 }}>{item.icon}</span>
            </div>
          ))}
        </div>
      )}

      {/* Daily view - Attendance table */}
      {view === 'daily' && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Status</th>
                <th>Mark Attendance</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => {
                const currentStatus = getStatus(emp.id, selectedDate);
                return (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: emp.avatarColor,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 700, color: '#fff',
                        }}>{emp.name.split(' ').map(n => n[0]).join('')}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff', fontSize: 13 }}>{emp.name}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{emp.department}</span>
                    </td>
                    <td>
                      {currentStatus ? (
                        <span style={{
                          padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                          background: `${getAttendanceColor(currentStatus)}20`,
                          color: getAttendanceColor(currentStatus),
                          border: `1px solid ${getAttendanceColor(currentStatus)}40`,
                        }}>
                          {STATUS_ICONS[currentStatus]} {STATUS_LABELS[currentStatus]}
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>Not marked</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {STATUS_OPTIONS.map(s => (
                          <button key={s} onClick={() => handleMark(emp.id, selectedDate, s)}
                            style={{
                              padding: '5px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                              background: currentStatus === s ? `${getAttendanceColor(s)}30` : 'rgba(255,255,255,0.06)',
                              color: currentStatus === s ? getAttendanceColor(s) : 'rgba(255,255,255,0.4)',
                              fontSize: 14, fontFamily: 'Inter', fontWeight: currentStatus === s ? 700 : 400,
                              transition: 'all 0.15s',
                              outline: currentStatus === s ? `2px solid ${getAttendanceColor(s)}60` : 'none',
                            }}
                            title={STATUS_LABELS[s]}
                          >{STATUS_ICONS[s]}</button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Monthly view */}
      {view === 'monthly' && (
        <div>
          <div style={{ marginBottom: 16, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
            Monthly attendance summary • Working days this month: <strong style={{ color: '#fff' }}>{workingDays}</strong>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
            {STATUS_OPTIONS.map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: getAttendanceColor(s) }} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{STATUS_LABELS[s]}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Weekend</span>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style={{ position: 'sticky', left: 0, background: '#0d0f2b', zIndex: 2 }}>Employee</th>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dow = new Date(dateStr).getDay();
                    const isWeekend = dow === 0 || dow === 6;
                    return (
                      <th key={day} style={{
                        padding: '8px 4px', minWidth: 28, textAlign: 'center',
                        color: isWeekend ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)',
                        fontSize: 11,
                      }}>{day}</th>
                    );
                  })}
                  <th>Present</th><th>Late</th><th>Absent</th><th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(emp => {
                  const stats = getMonthlyStats(emp.id);
                  return (
                    <tr key={emp.id}>
                      <td style={{ position: 'sticky', left: 0, background: '#0d0f2b', zIndex: 1, minWidth: 140 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: emp.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                            {emp.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>{emp.name.split(' ')[0]}</div>
                        </div>
                      </td>
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                        const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const dow = new Date(dateStr).getDay();
                        const isWeekend = dow === 0 || dow === 6;
                        const isFuture = new Date(dateStr) > now;
                        const status = attendance[dateStr]?.[emp.id];
                        const color = isWeekend ? 'rgba(255,255,255,0.06)' : isFuture ? 'transparent' : status ? getAttendanceColor(status) : 'rgba(255,71,87,0.3)';
                        return (
                          <td key={day} style={{ padding: '4px', textAlign: 'center' }}>
                            <div style={{
                              width: 20, height: 20, borderRadius: 4,
                              background: color,
                              margin: '0 auto',
                              title: STATUS_LABELS[status] || '',
                            }} title={STATUS_LABELS[status] || (isWeekend ? 'Weekend' : isFuture ? '' : 'Absent')} />
                          </td>
                        );
                      })}
                      <td style={{ color: '#00e676', fontWeight: 700, fontSize: 13 }}>{stats.present}</td>
                      <td style={{ color: '#ffa726', fontWeight: 700, fontSize: 13 }}>{stats.late}</td>
                      <td style={{ color: '#ff4757', fontWeight: 700, fontSize: 13 }}>{stats.absent}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div className="progress-bar" style={{ width: 50 }}>
                            <div className="progress-fill" style={{
                              width: `${stats.pct}%`,
                              background: stats.pct >= 85 ? 'linear-gradient(90deg, #00e676, #00b050)' : 'linear-gradient(90deg, #ffa726, #f57c00)',
                            }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: stats.pct >= 85 ? '#00e676' : '#ffa726' }}>{stats.pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
