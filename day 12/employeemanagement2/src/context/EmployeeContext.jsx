import React, { createContext, useState, useEffect } from 'react';

export const EmployeeContext = createContext();

const initialEmployees = [
  {
    id: 'EMP-2024-001',
    name: 'Sarah Jenkins',
    role: 'Lead Frontend Engineer',
    department: 'Engineering',
    email: 'sarah.j@company.com',
    phone: '+1 (555) 234-5678',
    joinDate: '2024-01-15',
    status: 'Active',
    salary: { base: 8500, allowances: 1200, deductions: 500 },
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    schedule: {
      Monday: 'Morning',
      Tuesday: 'Morning',
      Wednesday: 'Morning',
      Thursday: 'Morning',
      Friday: 'Morning',
      Saturday: 'Off',
      Sunday: 'Off'
    },
    attendance: [
      { date: '2026-07-06', status: 'Present', clockIn: '08:52', clockOut: '17:05' },
      { date: '2026-07-07', status: 'Present', clockIn: '08:45', clockOut: '17:15' },
      { date: '2026-07-08', status: 'Present', clockIn: '09:15', clockOut: '17:00' },
      { date: '2026-07-09', status: 'Present', clockIn: '08:50', clockOut: '17:10' },
      { date: '2026-07-10', status: 'Present', clockIn: '08:55', clockOut: '' }
    ],
    leaves: [
      { id: 'L-101', type: 'Sick Leave', startDate: '2026-06-12', endDate: '2026-06-13', reason: 'Flu recovery', status: 'Approved' }
    ]
  },
  {
    id: 'EMP-2024-002',
    name: 'David Chen',
    role: 'Full Stack Developer',
    department: 'Engineering',
    email: 'david.c@company.com',
    phone: '+1 (555) 876-5432',
    joinDate: '2024-03-10',
    status: 'Active',
    salary: { base: 7800, allowances: 1000, deductions: 450 },
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    schedule: {
      Monday: 'Morning',
      Tuesday: 'Morning',
      Wednesday: 'Morning',
      Thursday: 'Morning',
      Friday: 'Morning',
      Saturday: 'Off',
      Sunday: 'Off'
    },
    attendance: [
      { date: '2026-07-06', status: 'Present', clockIn: '08:30', clockOut: '17:00' },
      { date: '2026-07-07', status: 'Present', clockIn: '08:40', clockOut: '17:05' },
      { date: '2026-07-08', status: 'Present', clockIn: '08:35', clockOut: '17:10' },
      { date: '2026-07-09', status: 'Present', clockIn: '08:42', clockOut: '17:00' },
      { date: '2026-07-10', status: 'Present', clockIn: '08:38', clockOut: '' }
    ],
    leaves: []
  },
  {
    id: 'EMP-2024-003',
    name: 'Elena Rostova',
    role: 'Senior UI/UX Designer',
    department: 'Design',
    email: 'elena.r@company.com',
    phone: '+1 (555) 345-6789',
    joinDate: '2024-02-20',
    status: 'Active',
    salary: { base: 7200, allowances: 900, deductions: 400 },
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    schedule: {
      Monday: 'Afternoon',
      Tuesday: 'Afternoon',
      Wednesday: 'Afternoon',
      Thursday: 'Afternoon',
      Friday: 'Afternoon',
      Saturday: 'Off',
      Sunday: 'Off'
    },
    attendance: [
      { date: '2026-07-06', status: 'Present', clockIn: '13:00', clockOut: '21:00' },
      { date: '2026-07-07', status: 'Present', clockIn: '12:55', clockOut: '21:05' },
      { date: '2026-07-08', status: 'Present', clockIn: '13:10', clockOut: '21:00' },
      { date: '2026-07-09', status: 'On Leave', clockIn: '', clockOut: '' },
      { date: '2026-07-10', status: 'Present', clockIn: '12:58', clockOut: '' }
    ],
    leaves: [
      { id: 'L-102', type: 'Casual Leave', startDate: '2026-07-09', endDate: '2026-07-09', reason: 'Personal errands', status: 'Approved' }
    ]
  },
  {
    id: 'EMP-2025-004',
    name: 'Marcus Aurelius',
    role: 'HR Director',
    department: 'HR',
    email: 'marcus.a@company.com',
    phone: '+1 (555) 456-7890',
    joinDate: '2025-01-05',
    status: 'Active',
    salary: { base: 9000, allowances: 1500, deductions: 600 },
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    schedule: {
      Monday: 'Morning',
      Tuesday: 'Morning',
      Wednesday: 'Morning',
      Thursday: 'Morning',
      Friday: 'Morning',
      Saturday: 'Off',
      Sunday: 'Off'
    },
    attendance: [
      { date: '2026-07-06', status: 'Present', clockIn: '08:45', clockOut: '17:30' },
      { date: '2026-07-07', status: 'Present', clockIn: '08:50', clockOut: '17:30' },
      { date: '2026-07-08', status: 'Present', clockIn: '08:40', clockOut: '17:15' },
      { date: '2026-07-09', status: 'Present', clockIn: '08:52', clockOut: '17:30' },
      { date: '2026-07-10', status: 'Absent', clockIn: '', clockOut: '' }
    ],
    leaves: [
      { id: 'L-103', type: 'Sick Leave', startDate: '2026-07-13', endDate: '2026-07-14', reason: 'Dental appointment', status: 'Pending' }
    ]
  },
  {
    id: 'EMP-2025-005',
    name: 'Aisha Rahman',
    role: 'Growth Marketing Specialist',
    department: 'Marketing',
    email: 'aisha.r@company.com',
    phone: '+1 (555) 567-8901',
    joinDate: '2025-02-15',
    status: 'Active',
    salary: { base: 6500, allowances: 800, deductions: 350 },
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    schedule: {
      Monday: 'Morning',
      Tuesday: 'Morning',
      Wednesday: 'Morning',
      Thursday: 'Morning',
      Friday: 'Morning',
      Saturday: 'Off',
      Sunday: 'Off'
    },
    attendance: [
      { date: '2026-07-06', status: 'Present', clockIn: '08:55', clockOut: '17:00' },
      { date: '2026-07-07', status: 'Present', clockIn: '08:50', clockOut: '17:05' },
      { date: '2026-07-08', status: 'Present', clockIn: '09:05', clockOut: '17:00' },
      { date: '2026-07-09', status: 'Present', clockIn: '08:45', clockOut: '17:15' },
      { date: '2026-07-10', status: 'On Leave', clockIn: '', clockOut: '' }
    ],
    leaves: [
      { id: 'L-104', type: 'Casual Leave', startDate: '2026-07-10', endDate: '2026-07-10', reason: 'Family gathering', status: 'Approved' }
    ]
  },
  {
    id: 'EMP-2025-006',
    name: 'Johnathan Doe',
    role: 'Sales Representative',
    department: 'Sales',
    email: 'john.d@company.com',
    phone: '+1 (555) 678-9012',
    joinDate: '2025-03-01',
    status: 'Active',
    salary: { base: 5800, allowances: 1500, deductions: 300 },
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    schedule: {
      Monday: 'Morning',
      Tuesday: 'Morning',
      Wednesday: 'Morning',
      Thursday: 'Morning',
      Friday: 'Morning',
      Saturday: 'Off',
      Sunday: 'Off'
    },
    attendance: [
      { date: '2026-07-06', status: 'Present', clockIn: '08:40', clockOut: '17:00' },
      { date: '2026-07-07', status: 'Present', clockIn: '08:45', clockOut: '17:05' },
      { date: '2026-07-08', status: 'Present', clockIn: '08:55', clockOut: '17:10' },
      { date: '2026-07-09', status: 'Present', clockIn: '08:48', clockOut: '17:00' },
      { date: '2026-07-10', status: 'Present', clockIn: '08:51', clockOut: '' }
    ],
    leaves: []
  }
];

const initialPayrollHistory = [
  {
    id: 'PAY-2026-06',
    month: 'June 2026',
    processedDate: '2026-06-30',
    totalEmployees: 6,
    totalBase: 44800,
    totalAllowances: 6900,
    totalDeductions: 2600,
    totalNet: 49100,
    details: [
      { employeeId: 'EMP-2024-001', name: 'Sarah Jenkins', base: 8500, allowances: 1200, deductions: 500, net: 9200, status: 'Paid' },
      { employeeId: 'EMP-2024-002', name: 'David Chen', base: 7800, allowances: 1000, deductions: 450, net: 8350, status: 'Paid' },
      { employeeId: 'EMP-2024-003', name: 'Elena Rostova', base: 7200, allowances: 900, deductions: 400, net: 7700, status: 'Paid' },
      { employeeId: 'EMP-2025-004', name: 'Marcus Aurelius', base: 9000, allowances: 1500, deductions: 600, net: 9900, status: 'Paid' },
      { employeeId: 'EMP-2025-005', name: 'Aisha Rahman', base: 6500, allowances: 800, deductions: 350, net: 6950, status: 'Paid' },
      { employeeId: 'EMP-2025-006', name: 'Johnathan Doe', base: 5800, allowances: 1500, deductions: 300, net: 7000, status: 'Paid' }
    ]
  }
];

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('ems_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [payrollHistory, setPayrollHistory] = useState(() => {
    const saved = localStorage.getItem('ems_payroll');
    return saved ? JSON.parse(saved) : initialPayrollHistory;
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('ems_activities');
    return saved ? JSON.parse(saved) : [
      { id: 'act-1', text: 'Sarah Jenkins clocked in', time: '08:55 AM, Today', type: 'attendance' },
      { id: 'act-2', text: 'Marcus Aurelius was marked Absent', time: '09:30 AM, Today', type: 'system' },
      { id: 'act-3', text: 'Leave approved: Aisha Rahman (Casual Leave)', time: '04:15 PM, Yesterday', type: 'leave' },
      { id: 'act-4', text: 'New employee onboarded: Johnathan Doe', time: '01 Jul 2026', type: 'employee' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('ems_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('ems_payroll', JSON.stringify(payrollHistory));
  }, [payrollHistory]);

  useEffect(() => {
    localStorage.setItem('ems_activities', JSON.stringify(activities));
  }, [activities]);

  const addActivity = (text, type = 'system') => {
    const newActivity = {
      id: `act-${Date.now()}`,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      type
    };
    setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
  };

  const addEmployee = (employeeData) => {
    const newEmp = {
      ...employeeData,
      id: `EMP-${new Date().getFullYear()}-${String(employees.length + 1).padStart(3, '0')}`,
      status: employeeData.status || 'Active',
      attendance: [],
      leaves: [],
      schedule: employeeData.schedule || {
        Monday: 'Morning',
        Tuesday: 'Morning',
        Wednesday: 'Morning',
        Thursday: 'Morning',
        Friday: 'Morning',
        Saturday: 'Off',
        Sunday: 'Off'
      }
    };
    setEmployees(prev => [...prev, newEmp]);
    addActivity(`New employee registered: ${newEmp.name} (${newEmp.role})`, 'employee');
  };

  const updateEmployee = (id, updatedFields) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        return { ...emp, ...updatedFields };
      }
      return emp;
    }));
    addActivity(`Employee profile updated: ${updatedFields.name || 'ID ' + id}`, 'employee');
  };

  const deleteEmployee = (id) => {
    const empToDelete = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    addActivity(`Employee deleted: ${empToDelete ? empToDelete.name : id}`, 'employee');
  };

  const clockIn = (employeeId, timeStr) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId) {
        const hasTodayRecord = emp.attendance.find(a => a.date === todayStr);
        let newAttendance;
        if (hasTodayRecord) {
          newAttendance = emp.attendance.map(a => a.date === todayStr ? { ...a, status: 'Present', clockIn: timeStr } : a);
        } else {
          newAttendance = [...emp.attendance, { date: todayStr, status: 'Present', clockIn: timeStr, clockOut: '' }];
        }
        return { ...emp, attendance: newAttendance };
      }
      return emp;
    }));
    const emp = employees.find(e => e.id === employeeId);
    addActivity(`${emp ? emp.name : 'Employee'} clocked in at ${timeStr}`, 'attendance');
  };

  const clockOut = (employeeId, timeStr) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId) {
        const newAttendance = emp.attendance.map(a => {
          if (a.date === todayStr) {
            return { ...a, clockOut: timeStr };
          }
          return a;
        });
        return { ...emp, attendance: newAttendance };
      }
      return emp;
    }));
    const emp = employees.find(e => e.id === employeeId);
    addActivity(`${emp ? emp.name : 'Employee'} clocked out at ${timeStr}`, 'attendance');
  };

  const markAttendanceStatus = (employeeId, status, dateStr = new Date().toISOString().split('T')[0]) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId) {
        const hasDateRecord = emp.attendance.find(a => a.date === dateStr);
        let newAttendance;
        if (hasDateRecord) {
          newAttendance = emp.attendance.map(a => a.date === dateStr ? { ...a, status } : a);
        } else {
          newAttendance = [...emp.attendance, { date: dateStr, status, clockIn: '', clockOut: '' }];
        }
        return { ...emp, attendance: newAttendance };
      }
      return emp;
    }));
    const emp = employees.find(e => e.id === employeeId);
    addActivity(`${emp ? emp.name : 'Employee'} marked as ${status} for ${dateStr}`, 'attendance');
  };

  const requestLeave = (employeeId, leaveData) => {
    const newLeave = {
      ...leaveData,
      id: `L-${Date.now().toString().slice(-4)}`,
      status: 'Pending'
    };
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId) {
        return { ...emp, leaves: [...emp.leaves, newLeave] };
      }
      return emp;
    }));
    const emp = employees.find(e => e.id === employeeId);
    addActivity(`Leave request submitted by ${emp ? emp.name : 'Employee'} (${leaveData.type})`, 'leave');
  };

  const updateLeaveStatus = (employeeId, leaveId, status) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId) {
        const updatedLeaves = emp.leaves.map(l => l.id === leaveId ? { ...l, status } : l);
        
        let updatedAttendance = [...emp.attendance];
        if (status === 'Approved') {
          const leave = emp.leaves.find(l => l.id === leaveId);
          if (leave) {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
              const dStr = d.toISOString().split('T')[0];
              const idx = updatedAttendance.findIndex(a => a.date === dStr);
              if (idx > -1) {
                updatedAttendance[idx] = { ...updatedAttendance[idx], status: 'On Leave', clockIn: '', clockOut: '' };
              } else {
                updatedAttendance.push({ date: dStr, status: 'On Leave', clockIn: '', clockOut: '' });
              }
            }
          }
        }
        return { ...emp, leaves: updatedLeaves, attendance: updatedAttendance };
      }
      return emp;
    }));
    const emp = employees.find(e => e.id === employeeId);
    addActivity(`Leave request ${status.toLowerCase()} for ${emp ? emp.name : 'Employee'}`, 'leave');
  };

  const updateSchedule = (employeeId, weeklySchedule) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId) {
        return { ...emp, schedule: weeklySchedule };
      }
      return emp;
    }));
    const emp = employees.find(e => e.id === employeeId);
    addActivity(`Weekly shifts updated for ${emp ? emp.name : 'Employee'}`, 'system');
  };

  const processPayrollForMonth = (monthName) => {
    if (payrollHistory.find(p => p.month.toLowerCase() === monthName.toLowerCase())) {
      addActivity(`Payroll already processed for ${monthName}`, 'system');
      return false;
    }

    const details = employees.map(emp => {
      const base = emp.salary.base;
      const allowances = emp.salary.allowances;
      const deductions = emp.salary.deductions;
      const net = base + allowances - deductions;
      return {
        employeeId: emp.id,
        name: emp.name,
        base,
        allowances,
        deductions,
        net,
        status: 'Paid'
      };
    });

    const totalBase = details.reduce((sum, d) => sum + d.base, 0);
    const totalAllowances = details.reduce((sum, d) => sum + d.allowances, 0);
    const totalDeductions = details.reduce((sum, d) => sum + d.deductions, 0);
    const totalNet = details.reduce((sum, d) => sum + d.net, 0);

    const newPayroll = {
      id: `PAY-${Date.now().toString().slice(-4)}`,
      month: monthName,
      processedDate: new Date().toISOString().split('T')[0],
      totalEmployees: employees.length,
      totalBase,
      totalAllowances,
      totalDeductions,
      totalNet,
      details
    };

    setPayrollHistory(prev => [newPayroll, ...prev]);
    addActivity(`Processed payroll for ${monthName}: Total Payout $${totalNet.toLocaleString()}`, 'system');
    return true;
  };

  return (
    <EmployeeContext.Provider value={{
      employees,
      payrollHistory,
      activities,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      clockIn,
      clockOut,
      markAttendanceStatus,
      requestLeave,
      updateLeaveStatus,
      updateSchedule,
      processPayrollForMonth,
      addActivity
    }}>
      {children}
    </EmployeeContext.Provider>
  );
};
