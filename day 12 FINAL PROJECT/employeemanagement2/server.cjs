const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;
const DB_PATH = path.join(__dirname, 'backend', 'db.json');

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Helper: Read / Write db.json ──────────────────────────────────────────
const readDB = () => {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
};

const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

// ══════════════════════════════════════════════════════════════════════════════
//  EMPLOYEES
// ══════════════════════════════════════════════════════════════════════════════

// GET  /api/employees
app.get('/api/employees', (req, res) => {
  try {
    const db = readDB();
    res.json({ success: true, data: db.employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET  /api/employees/:id
app.get('/api/employees/:id', (req, res) => {
  try {
    const db = readDB();
    const emp = db.employees.find(e => e.id === req.params.id);
    if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, data: emp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/employees
app.post('/api/employees', (req, res) => {
  try {
    const db = readDB();
    const newEmp = { id: 'EMP' + Date.now(), ...req.body };
    db.employees.push(newEmp);
    writeDB(db);
    res.status(201).json({ success: true, data: newEmp, message: 'Employee created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT  /api/employees/:id
app.put('/api/employees/:id', (req, res) => {
  try {
    const db = readDB();
    const idx = db.employees.findIndex(e => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Employee not found' });
    db.employees[idx] = { ...db.employees[idx], ...req.body };
    writeDB(db);
    res.json({ success: true, data: db.employees[idx], message: 'Employee updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/employees/:id
app.delete('/api/employees/:id', (req, res) => {
  try {
    const db = readDB();
    const idx = db.employees.findIndex(e => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Employee not found' });
    const deleted = db.employees.splice(idx, 1)[0];
    writeDB(db);
    res.json({ success: true, data: deleted, message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
//  LEAVES
// ══════════════════════════════════════════════════════════════════════════════

// GET  /api/leaves
app.get('/api/leaves', (req, res) => {
  try {
    const db = readDB();
    res.json({ success: true, data: db.leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET  /api/leaves/:id
app.get('/api/leaves/:id', (req, res) => {
  try {
    const db = readDB();
    const lv = db.leaves.find(l => l.id === req.params.id);
    if (!lv) return res.status(404).json({ success: false, message: 'Leave not found' });
    res.json({ success: true, data: lv });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/leaves
app.post('/api/leaves', (req, res) => {
  try {
    const db = readDB();
    const newLeave = {
      id: 'LV' + Date.now(),
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
      ...req.body,
    };
    db.leaves.unshift(newLeave);
    writeDB(db);
    res.status(201).json({ success: true, data: newLeave, message: 'Leave applied successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT  /api/leaves/:id
app.put('/api/leaves/:id', (req, res) => {
  try {
    const db = readDB();
    const idx = db.leaves.findIndex(l => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Leave not found' });
    db.leaves[idx] = { ...db.leaves[idx], ...req.body };
    writeDB(db);
    res.json({ success: true, data: db.leaves[idx], message: 'Leave updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/leaves/:id
app.delete('/api/leaves/:id', (req, res) => {
  try {
    const db = readDB();
    const idx = db.leaves.findIndex(l => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Leave not found' });
    const deleted = db.leaves.splice(idx, 1)[0];
    writeDB(db);
    res.json({ success: true, data: deleted, message: 'Leave deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
//  ATTENDANCE
// ══════════════════════════════════════════════════════════════════════════════

// GET  /api/attendance
app.get('/api/attendance', (req, res) => {
  try {
    const db = readDB();
    res.json({ success: true, data: db.attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET  /api/attendance/:date
app.get('/api/attendance/:date', (req, res) => {
  try {
    const db = readDB();
    const record = db.attendance[req.params.date] || {};
    res.json({ success: true, date: req.params.date, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/attendance  — body: { date, empId, status }
app.post('/api/attendance', (req, res) => {
  try {
    const { date, empId, status } = req.body;
    if (!date || !empId || !status)
      return res.status(400).json({ success: false, message: 'date, empId and status are required' });
    const db = readDB();
    if (!db.attendance[date]) db.attendance[date] = {};
    db.attendance[date][empId] = status;
    writeDB(db);
    res.json({ success: true, data: db.attendance[date], message: `Attendance marked as ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
//  NOTIFICATIONS
// ══════════════════════════════════════════════════════════════════════════════

// GET  /api/notifications
app.get('/api/notifications', (req, res) => {
  try {
    const db = readDB();
    res.json({ success: true, data: db.notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/notifications
app.post('/api/notifications', (req, res) => {
  try {
    const db = readDB();
    const note = { id: 'N' + Date.now(), read: false, time: 'Just now', ...req.body };
    db.notifications.unshift(note);
    writeDB(db);
    res.status(201).json({ success: true, data: note, message: 'Notification created' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT  /api/notifications/mark-all-read  (must be BEFORE /:id)
app.put('/api/notifications/mark-all-read', (req, res) => {
  try {
    const db = readDB();
    db.notifications = db.notifications.map(n => ({ ...n, read: true }));
    writeDB(db);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT  /api/notifications/:id
app.put('/api/notifications/:id', (req, res) => {
  try {
    const db = readDB();
    const idx = db.notifications.findIndex(n => n.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Notification not found' });
    db.notifications[idx] = { ...db.notifications[idx], ...req.body };
    writeDB(db);
    res.json({ success: true, data: db.notifications[idx], message: 'Notification updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/notifications/:id
app.delete('/api/notifications/:id', (req, res) => {
  try {
    const db = readDB();
    const idx = db.notifications.findIndex(n => n.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Notification not found' });
    const deleted = db.notifications.splice(idx, 1)[0];
    writeDB(db);
    res.json({ success: true, data: deleted, message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Root health check ──────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '✅ Employee Management API is running',
    version: '1.0.0',
    endpoints: {
      employees:     'GET | POST /api/employees',
      employee:      'GET | PUT | DELETE /api/employees/:id',
      leaves:        'GET | POST /api/leaves',
      leave:         'GET | PUT | DELETE /api/leaves/:id',
      attendance:    'GET | POST /api/attendance',
      attendanceDate:'GET /api/attendance/:date',
      notifications: 'GET | POST /api/notifications',
      notification:  'PUT | DELETE /api/notifications/:id',
      markAllRead:   'PUT /api/notifications/mark-all-read',
    },
  });
});

// ─── Start server ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Employee Management API Server`);
  console.log(`   Running on : http://localhost:${PORT}`);
  console.log(`   DB file    : ${DB_PATH}`);
  console.log(`\n📋 Available Endpoints:`);
  console.log(`   GET    http://localhost:${PORT}/api/employees`);
  console.log(`   POST   http://localhost:${PORT}/api/employees`);
  console.log(`   GET    http://localhost:${PORT}/api/employees/:id`);
  console.log(`   PUT    http://localhost:${PORT}/api/employees/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/employees/:id`);
  console.log(`   GET    http://localhost:${PORT}/api/leaves`);
  console.log(`   POST   http://localhost:${PORT}/api/leaves`);
  console.log(`   PUT    http://localhost:${PORT}/api/leaves/:id`);
  console.log(`   GET    http://localhost:${PORT}/api/attendance`);
  console.log(`   POST   http://localhost:${PORT}/api/attendance`);
  console.log(`   GET    http://localhost:${PORT}/api/notifications`);
  console.log(`   PUT    http://localhost:${PORT}/api/notifications/mark-all-read\n`);
});
