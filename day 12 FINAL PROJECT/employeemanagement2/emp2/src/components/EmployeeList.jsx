import React, { useState, useRef } from 'react';
import { getInitials, getStatusColor, formatCurrency, formatDate, getYearsOfService, avatarColors, generateEmployeeId } from '../utils/helpers';
import { DEPARTMENTS, ROLES } from '../data/mockData';

const DEPT_COLORS = {
  Engineering: '#6c63ff', Design: '#00d4ff', Marketing: '#ffa726',
  Sales: '#00e676', HR: '#ab47bc', Finance: '#ff4757', Operations: '#26c6da', Legal: '#ff7043',
};

export default function EmployeeList({ employees, onAddEmployee, onUpdateEmployee, onDeleteEmployee, onNavigate }) {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [addSearchVal, setAddSearchVal] = useState('');
  const [addDropdownOpen, setAddDropdownOpen] = useState(false);
  const addRef = useRef(null);

  // Filter & sort
  let filtered = employees.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.department.toLowerCase().includes(q);
    const matchDept = filterDept === 'All' || e.department === filterDept;
    const matchStatus = filterStatus === 'All' || e.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'salary') return b.salary - a.salary;
    if (sortBy === 'performance') return b.performance - a.performance;
    if (sortBy === 'joinDate') return new Date(b.joinDate) - new Date(a.joinDate);
    return 0;
  });

  // Smart add by typing - find matching names not yet added
  const addSuggestions = addSearchVal.trim().length >= 1
    ? employees.filter(e => e.name.toLowerCase().includes(addSearchVal.toLowerCase())).length === 0
      ? [{ isNew: true, name: addSearchVal }]
      : []
    : [];

  const handleQuickAdd = (name) => {
    const newId = generateEmployeeId(employees);
    const colorIdx = employees.length % avatarColors.length;
    const newEmp = {
      id: newId,
      name: name.trim(),
      email: `${name.trim().toLowerCase().replace(/\s+/g, '.')}@nexacorp.com`,
      phone: '+91 00000 00000',
      department: 'Engineering',
      role: 'Software Engineer',
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      salary: 60000,
      avatarColor: avatarColors[colorIdx],
      location: 'India',
      manager: 'TBD',
      skills: [],
      performance: 75,
      leaves: { total: 24, used: 0, remaining: 24 },
      address: '',
      emergencyContact: { name: '', relation: '', phone: '' },
      education: '',
      about: '',
    };
    onAddEmployee(newEmp);
    setAddSearchVal('');
    setAddDropdownOpen(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Header controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {/* Smart Add search box */}
        <div ref={addRef} style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(108,99,255,0.06)',
            border: `1px solid ${addDropdownOpen ? '#6c63ff' : 'rgba(108,99,255,0.25)'}`,
            borderRadius: 14,
            padding: '10px 16px',
            transition: 'all 0.2s',
            boxShadow: addDropdownOpen ? '0 0 0 3px rgba(108,99,255,0.15)' : 'none',
          }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>➕</span>
            <input
              value={addSearchVal}
              onChange={e => { setAddSearchVal(e.target.value); setAddDropdownOpen(true); }}
              onFocus={() => setAddDropdownOpen(true)}
              onBlur={() => setTimeout(() => setAddDropdownOpen(false), 200)}
              placeholder="Type employee name to add..."
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', fontSize: 14, width: '100%', fontFamily: 'Inter, sans-serif',
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && addSearchVal.trim()) {
                  handleQuickAdd(addSearchVal);
                }
              }}
            />
            {addSearchVal && (
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>Press Enter to add</span>
            )}
          </div>
          {addDropdownOpen && addSearchVal.trim().length >= 1 && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
              background: '#111230', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.4)', zIndex: 999,
              overflow: 'hidden',
            }}>
              <div
                onClick={() => handleQuickAdd(addSearchVal)}
                style={{
                  padding: '12px 16px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12,
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6c63ff, #00d4ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>➕</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#6c63ff' }}>Add "{addSearchVal}"</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Create new employee record</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search existing */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14, padding: '10px 16px',
          minWidth: 220,
        }}>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..."
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 13, width: '100%', fontFamily: 'Inter, sans-serif' }} />
        </div>

        {/* Dept filter */}
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', padding: '10px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          <option value="All">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        {/* Status filter */}
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', padding: '10px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          <option value="All">All Status</option>
          <option value="active">Active</option>
          <option value="on-leave">On Leave</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Sort */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', padding: '10px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          <option value="name">Sort: Name</option>
          <option value="salary">Sort: Salary</option>
          <option value="performance">Sort: Performance</option>
          <option value="joinDate">Sort: Join Date</option>
        </select>

        {/* View toggle */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
          {[['grid', '⊞'], ['table', '☰']].map(([mode, icon]) => (
            <button key={mode} onClick={() => setViewMode(mode)}
              style={{
                padding: '8px 14px', border: 'none', cursor: 'pointer',
                background: viewMode === mode ? 'rgba(108,99,255,0.3)' : 'transparent',
                color: viewMode === mode ? '#fff' : 'rgba(255,255,255,0.4)',
                fontSize: 16, transition: 'all 0.2s', fontFamily: 'Inter',
              }}>{icon}</button>
          ))}
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          ➕ Add Employee
        </button>
      </div>

      {/* Count bar */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
          Showing <span style={{ color: '#fff', fontWeight: 600 }}>{filtered.length}</span> of {employees.length} employees
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['All', ...DEPARTMENTS].slice(0, 5).map(dept => {
            const count = dept === 'All' ? employees.length : employees.filter(e => e.department === dept).length;
            return (
              <button key={dept} onClick={() => setFilterDept(dept)}
                style={{
                  padding: '3px 10px', borderRadius: 20, fontSize: 11,
                  fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  background: filterDept === dept ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${filterDept === dept ? '#6c63ff' : 'rgba(255,255,255,0.1)'}`,
                  color: filterDept === dept ? '#fff' : 'rgba(255,255,255,0.5)',
                  fontFamily: 'Inter',
                }}>
                {dept} {count > 0 && <span>({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid view */}
      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map(emp => (
            <EmployeeCard
              key={emp.id}
              emp={emp}
              onView={() => onNavigate('employee-detail', emp)}
              onDelete={() => onDeleteEmployee(emp.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1' }}>
              <div className="empty-state">
                <div className="empty-state-icon">👤</div>
                <div className="empty-state-text">No employees found</div>
                <div className="empty-state-sub">Try adjusting your search or filters</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Table view */}
      {viewMode === 'table' && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>ID</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
                <th>Salary</th>
                <th>Performance</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: emp.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
                        {getInitials(emp.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: 13 }}>{emp.name}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: '#6c63ff' }}>{emp.id}</span></td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: `${DEPT_COLORS[emp.department] || '#6c63ff'}1a`,
                      color: DEPT_COLORS[emp.department] || '#6c63ff',
                    }}>{emp.department}</span>
                  </td>
                  <td style={{ fontSize: 13 }}>{emp.role}</td>
                  <td>
                    <span className={`badge badge-${getStatusColor(emp.status)}`}>
                      {emp.status === 'active' ? '● Active' : emp.status === 'on-leave' ? '● On Leave' : '● Inactive'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#00e676', fontSize: 13 }}>{formatCurrency(emp.salary)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ width: 60 }}>
                        <div className="progress-fill" style={{
                          width: `${emp.performance}%`,
                          background: emp.performance >= 90 ? 'linear-gradient(90deg,#00e676,#00b050)' : 'linear-gradient(90deg,#ffa726,#f57c00)',
                        }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: emp.performance >= 90 ? '#00e676' : '#ffa726' }}>{emp.performance}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{formatDate(emp.joinDate)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => onNavigate('employee-detail', emp)}
                        style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(108,99,255,0.2)', border: '1px solid rgba(108,99,255,0.3)', color: '#6c63ff', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'Inter' }}>
                        View
                      </button>
                      <button onClick={() => onDeleteEmployee(emp.id)}
                        style={{ padding: '5px 10px', borderRadius: 8, background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.2)', color: '#ff4757', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter' }}>
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">👤</div>
              <div className="empty-state-text">No employees found</div>
            </div>
          )}
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <AddEmployeeModal
          employees={employees}
          onAdd={(emp) => { onAddEmployee(emp); setShowAddModal(false); }}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

function EmployeeCard({ emp, onView, onDelete }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 20,
        padding: '24px',
        transition: 'all 0.3s',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? '0 12px 40px rgba(108,99,255,0.15)' : 'none',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={onView}
    >
      {/* Dept accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: DEPT_COLORS[emp.department] || '#6c63ff',
        opacity: hovered ? 1 : 0.5,
        transition: 'opacity 0.3s',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: emp.avatarColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 700, color: '#fff',
            boxShadow: `0 6px 20px rgba(0,0,0,0.3)`,
          }}>{getInitials(emp.name)}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{emp.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{emp.role}</div>
          </div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          style={{
            background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.2)',
            borderRadius: 8, width: 30, height: 30, cursor: 'pointer',
            color: '#ff4757', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hovered ? 1 : 0, transition: 'opacity 0.2s',
          }}>🗑</button>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <span style={{
          padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
          background: `${DEPT_COLORS[emp.department] || '#6c63ff'}1a`,
          color: DEPT_COLORS[emp.department] || '#6c63ff',
        }}>{emp.department}</span>
        <span className={`badge badge-${getStatusColor(emp.status)}`}>
          {emp.status === 'active' ? 'Active' : emp.status === 'on-leave' ? 'On Leave' : 'Inactive'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Salary</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#00e676' }}>{formatCurrency(emp.salary)}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Experience</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#00d4ff' }}>{getYearsOfService(emp.joinDate)}</div>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Performance</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: emp.performance >= 90 ? '#00e676' : '#ffa726' }}>{emp.performance}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{
            width: `${emp.performance}%`,
            background: emp.performance >= 90
              ? 'linear-gradient(90deg, #00e676, #00b050)'
              : 'linear-gradient(90deg, #ffa726, #f57c00)',
          }} />
        </div>
      </div>

      {emp.skills && emp.skills.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {emp.skills.slice(0, 3).map(skill => (
            <span key={skill} style={{
              padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600,
              background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)',
            }}>{skill}</span>
          ))}
          {emp.skills.length > 3 && (
            <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>+{emp.skills.length - 3}</span>
          )}
        </div>
      )}

      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12 }}>📍</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{emp.location}</span>
        </div>
        <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#6c63ff' }}>{emp.id}</span>
      </div>
    </div>
  );
}

function AddEmployeeModal({ employees, onAdd, onClose }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', department: 'Engineering',
    role: 'Software Engineer', salary: 60000, location: 'India',
    joinDate: new Date().toISOString().split('T')[0], status: 'active',
    manager: '', education: '', about: '', skills: '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = generateEmployeeId(employees);
    const colorIdx = employees.length % avatarColors.length;
    onAdd({
      ...form,
      id: newId,
      salary: Number(form.salary),
      avatarColor: avatarColors[colorIdx],
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      performance: 75,
      leaves: { total: 24, used: 0, remaining: 24 },
      address: '',
      emergencyContact: { name: '', relation: '', phone: '' },
    });
  };

  const roles = ROLES[form.department] || [];

  return (
    <div className="modal-overlay">
      <div className="modal modal-lg">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>Add New Employee</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Fill in the details to onboard a new employee</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', width: 36, height: 36, borderRadius: 10, cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid" style={{ marginBottom: 16 }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. John Smith" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@nexacorp.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" />
            </div>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select className="select" value={form.department} onChange={e => { set('department', e.target.value); set('role', ROLES[e.target.value]?.[0] || ''); }}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Role *</label>
              <select className="select" value={form.role} onChange={e => set('role', e.target.value)}>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Monthly Salary (₹)</label>
              <input className="input" type="number" value={form.salary} onChange={e => set('salary', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Join Date</label>
              <input className="input" type="date" value={form.joinDate} onChange={e => set('joinDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="City, Country" />
            </div>
            <div className="form-group">
              <label className="form-label">Manager</label>
              <input className="input" value={form.manager} onChange={e => set('manager', e.target.value)} placeholder="Reporting manager name" />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="select" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="on-leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Skills (comma separated)</label>
            <input className="input" value={form.skills} onChange={e => set('skills', e.target.value)} placeholder="React, Node.js, Python" />
          </div>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Education</label>
            <input className="input" value={form.education} onChange={e => set('education', e.target.value)} placeholder="B.Tech Computer Science - IIT (2020)" />
          </div>
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label">About</label>
            <textarea className="textarea" rows={3} value={form.about} onChange={e => set('about', e.target.value)} placeholder="Brief description about the employee..." />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary">➕ Add Employee</button>
          </div>
        </form>
      </div>
    </div>
  );
}
