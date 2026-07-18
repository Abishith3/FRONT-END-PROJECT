// Utility helper functions

export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
};

export const formatDateShort = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const getYearsOfService = (joinDate) => {
  const join = new Date(joinDate);
  const now = new Date();
  const diff = now - join;
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
  if (years === 0) return `${months}m`;
  if (months === 0) return `${years}y`;
  return `${years}y ${months}m`;
};

export const calculateSalaryBreakdown = (baseSalary) => {
  const basic = Math.round(baseSalary * 0.40);
  const hra = Math.round(baseSalary * 0.20);
  const da = Math.round(baseSalary * 0.15);
  const ta = Math.round(baseSalary * 0.05);
  const special = baseSalary - basic - hra - da - ta;
  const pf = Math.round(basic * 0.12);
  const professionalTax = 200;
  const incomeTax = Math.round(baseSalary * 0.10);
  const totalDeductions = pf + professionalTax + incomeTax;
  const grossSalary = basic + hra + da + ta + special;
  const netSalary = grossSalary - totalDeductions;
  return {
    earnings: { basic, hra, da, ta, special },
    deductions: { pf, professionalTax, incomeTax },
    grossSalary,
    totalDeductions,
    netSalary,
  };
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'success';
    case 'on-leave': return 'warning';
    case 'inactive': return 'danger';
    default: return 'info';
  }
};

export const getAttendanceColor = (status) => {
  switch (status) {
    case 'present': return '#00e676';
    case 'late': return '#ffa726';
    case 'absent': return '#ff4757';
    case 'leave': return '#29b6f6';
    case 'holiday': return '#ab47bc';
    default: return 'transparent';
  }
};

export const generateEmployeeId = (existingEmployees) => {
  const nums = existingEmployees
    .map(e => parseInt(e.id.replace('EMP', ''), 10))
    .filter(n => !isNaN(n));
  const maxNum = nums.length > 0 ? Math.max(...nums) : 0;
  return `EMP${String(maxNum + 1).padStart(3, '0')}`;
};

export const getMonthName = (month, year) => {
  return new Date(year, month - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
};

export const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

export const isWeekend = (dateStr) => {
  const day = new Date(dateStr).getDay();
  return day === 0 || day === 6;
};

export const getWorkingDaysInMonth = (year, month) => {
  const days = getDaysInMonth(year, month);
  let count = 0;
  for (let d = 1; d <= days; d++) {
    const date = new Date(year, month - 1, d);
    if (date.getDay() !== 0 && date.getDay() !== 6) count++;
  }
  return count;
};

export const calculateAttendanceStats = (attendance, empId, year, month) => {
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
  const workingDays = getWorkingDaysInMonth(year, month);
  const nowDate = new Date();
  const isCurrent = year === nowDate.getFullYear() && month === nowDate.getMonth() + 1;
  const total = isCurrent ? Object.keys(attendance).filter(d => {
    const da = new Date(d);
    return da.getFullYear() === year && da.getMonth() + 1 === month;
  }).length : workingDays;
  const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
  return { present, late, absent, leave, workingDays, total, percentage };
};

export const avatarColors = [
  'linear-gradient(135deg, #6c63ff, #4a42d4)',
  'linear-gradient(135deg, #00d4ff, #0099cc)',
  'linear-gradient(135deg, #ff4757, #cc0015)',
  'linear-gradient(135deg, #00e676, #00b050)',
  'linear-gradient(135deg, #ffa726, #f57c00)',
  'linear-gradient(135deg, #ab47bc, #7b1fa2)',
  'linear-gradient(135deg, #ef5350, #b71c1c)',
  'linear-gradient(135deg, #26c6da, #00838f)',
  'linear-gradient(135deg, #66bb6a, #388e3c)',
  'linear-gradient(135deg, #ff7043, #bf360c)',
  'linear-gradient(135deg, #8d6e63, #4e342e)',
  'linear-gradient(135deg, #78909c, #37474f)',
];

export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const generatePayslipNumber = (empId, month, year) => {
  return `PAY-${year}${String(month).padStart(2, '0')}-${empId}`;
};
