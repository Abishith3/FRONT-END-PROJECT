import React, { useState, useContext } from 'react';
import { EmployeeContext } from '../context/EmployeeContext';
import { 
  Clock, 
  UserCheck, 
  UserX, 
  CalendarDays, 
  Check, 
  X, 
  ClipboardList, 
  Send,
  CalendarCheck
} from 'lucide-react';

export default function AttendanceTracker() {
  const { 
    employees, 
    clockIn, 
    clockOut, 
    markAttendanceStatus, 
    requestLeave, 
    updateLeaveStatus 
  } = useContext(EmployeeContext);

  const todayStr = new Date().toISOString().split('T')[0];
  const [activeTab, setActiveTab] = useState('logs'); // 'logs', 'leaves', 'request'
  const [simTimes, setSimTimes] = useState({}); // { empId: '09:00' }

  // Form State for Leave Request Simulator
  const [leaveForm, setLeaveForm] = useState({
    employeeId: employees[0]?.id || '',
    type: 'Sick Leave',
    startDate: todayStr,
    endDate: todayStr,
    reason: ''
  });

  const handleSimTimeChange = (empId, val) => {
    setSimTimes(prev => ({ ...prev, [empId]: val }));
  };

  const triggerClockIn = (empId) => {
    const time = simTimes[empId] || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    clockIn(empId, time);
    
    // Check if late (arbitrary threshold e.g. after 09:00 AM is late)
    const [hours, minutes] = time.split(':');
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    if (totalMinutes > 9 * 60) {
      markAttendanceStatus(empId, 'Late', todayStr);
    }
  };

  const triggerClockOut = (empId) => {
    const time = simTimes[empId] || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    clockOut(empId, time);
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveForm.employeeId) return;

    requestLeave(leaveForm.employeeId, {
      type: leaveForm.type,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      reason: leaveForm.reason
    });

    setLeaveForm({
      employeeId: employees[0]?.id || '',
      type: 'Sick Leave',
      startDate: todayStr,
      endDate: todayStr,
      reason: ''
    });

    // Switch to leaves tab to see it
    setActiveTab('leaves');
  };

  // Compile all leave requests across all employees
  const allLeaves = [];
  employees.forEach(emp => {
    if (emp.leaves) {
      emp.leaves.forEach(l => {
        allLeaves.push({
          ...l,
          employeeId: emp.id,
          employeeName: emp.name,
          employeeRole: emp.role
        });
      });
    }
  });

  // Sort: Pending requests first
  const sortedLeaves = allLeaves.sort((a, b) => {
    if (a.status === 'Pending' && b.status !== 'Pending') return -1;
    if (a.status !== 'Pending' && b.status === 'Pending') return 1;
    return new Date(b.startDate) - new Date(a.startDate);
  });

  // Get today's logs for all employees
  const todayLogs = employees.map(emp => {
    const log = emp.attendance.find(a => a.date === todayStr);
    return {
      id: emp.id,
      name: emp.name,
      role: emp.role,
      avatar: emp.avatar,
      department: emp.department,
      status: log?.status || 'No Record',
      clockIn: log?.clockIn || '--:--',
      clockOut: log?.clockOut || '--:--'
    };
  });

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Attendance & Leaves</h1>
          <p className="section-subtitle">Simulate clock cycles, manage rosters, and approve leaves.</p>
        </div>
      </div>

      <div className="attendance-layout">
        
        {/* Left Side: Check-in/out Simulator */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} style={{ color: 'var(--primary)' }} /> Check-in Simulator
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Simulate day-to-day attendance actions for the active workforce.
          </p>

          <div className="sim-employee-list">
            {employees.filter(e => e.status === 'Active').map(emp => {
              const todayRec = emp.attendance.find(a => a.date === todayStr);
              const isClockedIn = todayRec && todayRec.clockIn && !todayRec.clockOut;
              const isClockedOut = todayRec && todayRec.clockIn && todayRec.clockOut;
              const isOnLeave = todayRec && todayRec.status === 'On Leave';
              const isAbsent = todayRec && todayRec.status === 'Absent';
              
              let currentStatusBadge = <span className="badge badge-inactive">No Record</span>;
              if (isClockedIn) {
                currentStatusBadge = <span className={`badge ${todayRec.status === 'Late' ? 'badge-late' : 'badge-present'}`}>
                  {todayRec.status === 'Late' ? 'Clocked In (Late)' : 'Clocked In'}
                </span>;
              } else if (isClockedOut) {
                currentStatusBadge = <span className="badge badge-present">Completed</span>;
              } else if (isOnLeave) {
                currentStatusBadge = <span className="badge badge-leave">On Leave</span>;
              } else if (isAbsent) {
                currentStatusBadge = <span className="badge badge-absent">Absent</span>;
              }

              // Set default value for simulation clock input
              const defaultTime = simTimes[emp.id] || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

              return (
                <div key={emp.id} className="sim-employee-item">
                  <div className="sim-employee-info">
                    <img src={emp.avatar} alt={emp.name} className="sim-avatar" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="sim-name">{emp.name}</span>
                      <span className="sim-role">{emp.role}</span>
                      <div style={{ marginTop: '0.2rem' }}>{currentStatusBadge}</div>
                    </div>
                  </div>

                  <div className="sim-actions">
                    {!isClockedIn && !isClockedOut && !isOnLeave && !isAbsent && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-end' }}>
                        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                          <input 
                            type="time" 
                            value={defaultTime} 
                            onChange={(e) => handleSimTimeChange(emp.id, e.target.value)}
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: '80px' }}
                          />
                          <button onClick={() => triggerClockIn(emp.id)} className="btn btn-success" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                            Clock In
                          </button>
                        </div>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button onClick={() => markAttendanceStatus(emp.id, 'Absent', todayStr)} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>
                            Absent
                          </button>
                          <button onClick={() => markAttendanceStatus(emp.id, 'On Leave', todayStr)} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>
                            On Leave
                          </button>
                        </div>
                      </div>
                    )}

                    {isClockedIn && (
                      <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                        <input 
                          type="time" 
                          value={defaultTime} 
                          onChange={(e) => handleSimTimeChange(emp.id, e.target.value)}
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: '80px' }}
                        />
                        <button onClick={() => triggerClockOut(emp.id)} className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                          Clock Out
                        </button>
                      </div>
                    )}

                    {(isClockedOut || isOnLeave || isAbsent) && (
                      <button 
                        onClick={() => {
                          // Reset attendance status for today
                          markAttendanceStatus(emp.id, 'No Record', todayStr);
                        }} 
                        className="btn btn-secondary" 
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        Reset Status
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Log Panel, Leave Requests & Request Form */}
        <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '480px' }}>
          <div className="attendance-tabs">
            <button 
              className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              Today's Log
            </button>
            <button 
              className={`tab-btn ${activeTab === 'leaves' ? 'active' : ''}`}
              onClick={() => setActiveTab('leaves')}
            >
              Leave Pipeline ({allLeaves.filter(l => l.status === 'Pending').length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'request' ? 'active' : ''}`}
              onClick={() => setActiveTab('request')}
            >
              File Leave (Sim)
            </button>
          </div>

          {/* TAB 1: TODAY'S LOGS */}
          {activeTab === 'logs' && (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Status</th>
                    <th>In</th>
                    <th>Out</th>
                  </tr>
                </thead>
                <tbody>
                  {todayLogs.map(log => {
                    let statusBadge = <span className="badge badge-inactive">No Record</span>;
                    if (log.status === 'Present') statusBadge = <span className="badge badge-present">Present</span>;
                    if (log.status === 'Late') statusBadge = <span className="badge badge-late">Present (Late)</span>;
                    if (log.status === 'Absent') statusBadge = <span className="badge badge-absent">Absent</span>;
                    if (log.status === 'On Leave') statusBadge = <span className="badge badge-leave">On Leave</span>;

                    return (
                      <tr key={log.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img 
                              src={log.avatar} 
                              alt={log.name} 
                              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                            />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{log.name}</span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{log.role}</span>
                            </div>
                          </div>
                        </td>
                        <td>{statusBadge}</td>
                        <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{log.clockIn}</td>
                        <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{log.clockOut}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: LEAVE PIPELINE */}
          {activeTab === 'leaves' && (
            <div className="leave-request-list">
              {sortedLeaves.length > 0 ? (
                sortedLeaves.map(leave => (
                  <div key={leave.id} className="leave-request-card">
                    <div className="leave-card-header">
                      <div>
                        <span className="leave-card-user">{leave.employeeName}</span>
                        <span className="section-subtitle" style={{ display: 'block', fontSize: '0.75rem' }}>
                          {leave.employeeRole} • ID: {leave.employeeId}
                        </span>
                      </div>
                      <div>
                        {leave.status === 'Pending' ? (
                          <span className="badge badge-inactive">Pending</span>
                        ) : leave.status === 'Approved' ? (
                          <span className="badge badge-present">Approved</span>
                        ) : (
                          <span className="badge badge-absent">Rejected</span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-leave" style={{ fontSize: '0.65rem' }}>
                        {leave.type}
                      </span>
                      <span className="leave-card-dates">
                        {leave.startDate} to {leave.endDate}
                      </span>
                    </div>

                    <p className="leave-card-reason">
                      <strong>Reason:</strong> {leave.reason || 'No reason provided'}
                    </p>

                    {leave.status === 'Pending' && (
                      <div className="leave-card-actions">
                        <button 
                          onClick={() => updateLeaveStatus(leave.employeeId, leave.id, 'Rejected')} 
                          className="btn btn-secondary" 
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderColor: 'rgba(244,63,94,0.2)', color: '#fb7185' }}
                        >
                          <X size={14} />
                          Reject
                        </button>
                        <button 
                          onClick={() => updateLeaveStatus(leave.employeeId, leave.id, 'Approved')} 
                          className="btn btn-success" 
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        >
                          <Check size={14} />
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <CalendarCheck size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No leave requests lodged in the pipeline.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FILE LEAVE SIMULATOR */}
          {activeTab === 'request' && (
            <form onSubmit={handleLeaveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label>Select Employee</label>
                <select 
                  value={leaveForm.employeeId} 
                  onChange={(e) => setLeaveForm({ ...leaveForm, employeeId: e.target.value })}
                  required
                >
                  <option value="">Choose Employee...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Leave Category</label>
                <select 
                  value={leaveForm.type} 
                  onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                >
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>From Date</label>
                  <input 
                    type="date" 
                    value={leaveForm.startDate} 
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>To Date</label>
                  <input 
                    type="date" 
                    value={leaveForm.endDate} 
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reason for Leave</label>
                <textarea 
                  rows="3" 
                  value={leaveForm.reason} 
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="Provide background context for request..."
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end', marginTop: '0.5rem' }}>
                <Send size={16} />
                <span>Submit Leave Request</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
