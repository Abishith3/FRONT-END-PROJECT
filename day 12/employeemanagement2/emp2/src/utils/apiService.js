// ─── Base URL ──────────────────────────────────────────────────────────────────
const BASE_URL = 'http://localhost:5000/api';

// ─── Helper ────────────────────────────────────────────────────────────────────
const request = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'API request failed');
  return json.data ?? json;
};

// ══════════════════════════════════════════════════════════════════════════════
//  EMPLOYEES
// ══════════════════════════════════════════════════════════════════════════════

export const employeeAPI = {
  /** GET /api/employees — fetch all employees */
  getAll: () => request('/employees'),

  /** GET /api/employees/:id — fetch one employee */
  getById: (id) => request(`/employees/${id}`),

  /** POST /api/employees — create new employee */
  create: (data) =>
    request('/employees', { method: 'POST', body: JSON.stringify(data) }),

  /** PUT /api/employees/:id — update employee */
  update: (id, data) =>
    request(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  /** DELETE /api/employees/:id — delete employee */
  remove: (id) => request(`/employees/${id}`, { method: 'DELETE' }),
};

// ══════════════════════════════════════════════════════════════════════════════
//  LEAVES
// ══════════════════════════════════════════════════════════════════════════════

export const leaveAPI = {
  /** GET /api/leaves — fetch all leave requests */
  getAll: () => request('/leaves'),

  /** GET /api/leaves/:id — fetch one leave */
  getById: (id) => request(`/leaves/${id}`),

  /** POST /api/leaves — apply new leave */
  create: (data) =>
    request('/leaves', { method: 'POST', body: JSON.stringify(data) }),

  /** PUT /api/leaves/:id — update leave (approve/reject) */
  update: (id, data) =>
    request(`/leaves/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  /** DELETE /api/leaves/:id — delete leave */
  remove: (id) => request(`/leaves/${id}`, { method: 'DELETE' }),
};

// ══════════════════════════════════════════════════════════════════════════════
//  ATTENDANCE
// ══════════════════════════════════════════════════════════════════════════════

export const attendanceAPI = {
  /** GET /api/attendance — fetch all attendance records */
  getAll: () => request('/attendance'),

  /** GET /api/attendance/:date — fetch attendance for a specific date */
  getByDate: (date) => request(`/attendance/${date}`),

  /** POST /api/attendance — mark attendance
   *  Body: { date, empId, status }
   */
  mark: (date, empId, status) =>
    request('/attendance', {
      method: 'POST',
      body: JSON.stringify({ date, empId, status }),
    }),
};

// ══════════════════════════════════════════════════════════════════════════════
//  NOTIFICATIONS
// ══════════════════════════════════════════════════════════════════════════════

export const notificationAPI = {
  /** GET /api/notifications — fetch all notifications */
  getAll: () => request('/notifications'),

  /** POST /api/notifications — create a notification */
  create: (data) =>
    request('/notifications', { method: 'POST', body: JSON.stringify(data) }),

  /** PUT /api/notifications/:id — mark one as read / update */
  update: (id, data) =>
    request(`/notifications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  /** PUT /api/notifications/mark-all-read — mark all as read */
  markAllRead: () =>
    request('/notifications/mark-all-read', { method: 'PUT' }),

  /** DELETE /api/notifications/:id — delete a notification */
  remove: (id) => request(`/notifications/${id}`, { method: 'DELETE' }),
};
