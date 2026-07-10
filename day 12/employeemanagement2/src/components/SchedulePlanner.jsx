import React, { useState, useContext } from 'react';
import { EmployeeContext } from '../context/EmployeeContext';
import { 
  Calendar, 
  Filter, 
  Info,
  CheckCircle2
} from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SHIFTS = ['Morning', 'Afternoon', 'Night', 'Off'];

export default function SchedulePlanner() {
  const { employees, updateSchedule } = useContext(EmployeeContext);
  const [selectedDept, setSelectedDept] = useState('All');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Department list for dropdown
  const departments = ['All', ...new Set(employees.map(emp => emp.department))];

  const handleShiftChange = (employeeId, day, newShift) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    const updatedSchedule = {
      ...employee.schedule,
      [day]: newShift
    };

    updateSchedule(employeeId, updatedSchedule);
    setSaveSuccessMsg(`Shift updated for ${employee.name} on ${day}!`);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const filteredEmployees = employees.filter(emp => {
    return (selectedDept === 'All' || emp.department === selectedDept) && emp.status === 'Active';
  });

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Work Scheduling</h1>
          <p className="section-subtitle">Plan weekly shifts, assign roster positions, and organize coverage.</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="glass-panel schedule-toolbar" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Filter Team:</span>
          <select 
            value={selectedDept} 
            onChange={(e) => setSelectedDept(e.target.value)}
            style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
          >
            {departments.map((dept, idx) => (
              <option key={idx} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
            ))}
          </select>
        </div>

        {/* Legend */}
        <div className="schedule-legend">
          <div className="shift-dot-legend">
            <div className="shift-dot shift-morning" />
            <span>Morning (8AM - 4PM)</span>
          </div>
          <div className="shift-dot-legend">
            <div className="shift-dot shift-afternoon" />
            <span>Afternoon (4PM - 12AM)</span>
          </div>
          <div className="shift-dot-legend">
            <div className="shift-dot shift-night" />
            <span>Night (12AM - 8AM)</span>
          </div>
          <div className="shift-dot-legend">
            <div className="shift-dot shift-off" />
            <span>Scheduled Off</span>
          </div>
        </div>
      </div>

      {/* Inline Info Alert */}
      {saveSuccessMsg && (
        <div 
          className="glass-panel" 
          style={{ 
            padding: '0.85rem 1.25rem', 
            marginBottom: '1.25rem', 
            borderColor: 'rgba(16, 185, 129, 0.25)', 
            background: 'rgba(16, 185, 129, 0.08)',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fadeIn 0.2s ease',
            fontSize: '0.9rem'
          }}
        >
          <CheckCircle2 size={16} />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Matrix Scheduling Board */}
      <div className="schedule-grid-container">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              {DAYS.map((day) => (
                <th key={day}>{day.slice(0, 3)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="schedule-employee-info">
                      <img src={emp.avatar} alt={emp.name} className="schedule-avatar" />
                      <div className="schedule-emp-details">
                        <span className="schedule-emp-name">{emp.name}</span>
                        <span className="schedule-emp-role">{emp.role}</span>
                      </div>
                    </div>
                  </td>
                  
                  {DAYS.map((day) => {
                    const currentShift = emp.schedule?.[day] || 'Off';
                    let selectBgClass = 'shift-off';
                    if (currentShift === 'Morning') selectBgClass = 'shift-morning';
                    if (currentShift === 'Afternoon') selectBgClass = 'shift-afternoon';
                    if (currentShift === 'Night') selectBgClass = 'shift-night';

                    return (
                      <td key={day}>
                        <select
                          value={currentShift}
                          onChange={(e) => handleShiftChange(emp.id, day, e.target.value)}
                          className={`shift-select-box ${selectBgClass}`}
                        >
                          {SHIFTS.map((shift) => (
                            <option key={shift} value={shift} style={{ backgroundColor: 'var(--bg-modal)', color: 'var(--text-main)' }}>
                              {shift}
                            </option>
                          ))}
                        </select>
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={DAYS.length + 1} style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No active employees found to schedule.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div 
        className="glass-panel" 
        style={{ 
          marginTop: '1.5rem', 
          padding: '1.25rem', 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: '0.75rem', 
          background: 'rgba(99, 102, 241, 0.03)',
          borderColor: 'rgba(99, 102, 241, 0.1)'
        }}
      >
        <Info size={18} style={{ color: 'var(--primary)', marginTop: '0.15rem', flexShrink: 0 }} />
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          <strong>Scheduling Notes:</strong> Adjusting dropdown shift values modifies the rosters instantly. Changes automatically sync to each employee's details drawer profile and are cross-referenced on the dashboard's daily roster list.
        </div>
      </div>

    </div>
  );
}
