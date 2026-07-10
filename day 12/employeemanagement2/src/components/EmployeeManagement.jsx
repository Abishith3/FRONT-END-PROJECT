import React, { useState, useContext } from 'react';
import { EmployeeContext } from '../context/EmployeeContext';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  X, 
  Briefcase,
  User,
  CheckCircle2
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
];

export default function EmployeeManagement() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useContext(EmployeeContext);
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null); // Drawer
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: 'Engineering',
    email: '',
    phone: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    baseSalary: 4500,
    allowances: 500,
    deductions: 200,
    avatar: PRESET_AVATARS[0]
  });

  const openAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      role: '',
      department: 'Engineering',
      email: '',
      phone: '',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      baseSalary: 4500,
      allowances: 500,
      deductions: 200,
      avatar: PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)]
    });
    setIsModalOpen(true);
  };

  const openEditModal = (emp, e) => {
    e.stopPropagation();
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      role: emp.role,
      department: emp.department,
      email: emp.email,
      phone: emp.phone,
      joinDate: emp.joinDate,
      status: emp.status,
      baseSalary: emp.salary.base,
      allowances: emp.salary.allowances,
      deductions: emp.salary.deductions,
      avatar: emp.avatar
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this employee profile?')) {
      deleteEmployee(id);
      if (selectedProfile && selectedProfile.id === id) {
        setSelectedProfile(null);
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      name: formData.name,
      role: formData.role,
      department: formData.department,
      email: formData.email,
      phone: formData.phone,
      joinDate: formData.joinDate,
      status: formData.status,
      avatar: formData.avatar,
      salary: {
        base: Number(formData.baseSalary),
        allowances: Number(formData.allowances),
        deductions: Number(formData.deductions)
      }
    };

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, formattedData);
    } else {
      addEmployee(formattedData);
    }
    setIsModalOpen(false);
  };

  // Filter logic
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;
    
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Employee Directory</h1>
          <p className="section-subtitle">Manage active staff members, roles, salaries, and profiles.</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="glass-panel employee-filter-bar" style={{ padding: '1.25rem' }}>
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name, ID or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-selects">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="HR">HR</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="employee-grid">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((emp) => (
            <div 
              key={emp.id} 
              className="glass-card employee-card"
              onClick={() => setSelectedProfile(emp)}
              style={{ cursor: 'pointer' }}
            >
              <div className="employee-card-header">
                <img 
                  src={emp.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                  alt={emp.name} 
                  className="employee-card-avatar"
                />
                
                <div className="employee-card-actions">
                  <button onClick={(e) => openEditModal(emp, e)} className="action-btn-sm edit" title="Edit Profile">
                    <Edit size={14} />
                  </button>
                  <button onClick={(e) => handleDelete(emp.id, e)} className="action-btn-sm delete" title="Delete Profile">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="employee-card-body">
                <span className="emp-name">{emp.name}</span>
                <span className="emp-role">{emp.role}</span>
                <span className="emp-dept-tag">{emp.department}</span>
              </div>

              <div className="employee-card-footer">
                <div className="emp-meta-item">
                  <Mail size={13} />
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {emp.email}
                  </span>
                </div>
                <div className="emp-meta-item">
                  <Briefcase size={13} />
                  <span>ID: {emp.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                  <span className={`badge ${emp.status === 'Active' ? 'badge-present' : 'badge-inactive'}`}>
                    {emp.status}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    ${emp.salary?.base.toLocaleString()}/mo
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem' }} className="glass-panel">
            <User size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>No employees found matching filter options.</p>
          </div>
        )}
      </div>

      {/* Slide-out Profile Details Drawer */}
      {selectedProfile && (
        <div className="drawer-overlay" onClick={() => setSelectedProfile(null)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="drawer-profile-header">
                <img 
                  src={selectedProfile.avatar} 
                  alt={selectedProfile.name} 
                  className="drawer-avatar"
                />
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{selectedProfile.name}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{selectedProfile.role}</p>
                  <span className="emp-dept-tag">{selectedProfile.department}</span>
                </div>
              </div>
              <button onClick={() => setSelectedProfile(null)} className="modal-close">
                <X size={20} />
              </button>
            </div>

            {/* Profile Content */}
            <div className="profile-section">
              <h3 className="profile-section-title">Personal Information</h3>
              <div className="profile-grid-list">
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Employee ID</span>
                  <span className="profile-detail-value">{selectedProfile.id}</span>
                </div>
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Email Address</span>
                  <span className="profile-detail-value">{selectedProfile.email}</span>
                </div>
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Phone Number</span>
                  <span className="profile-detail-value">{selectedProfile.phone}</span>
                </div>
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Joining Date</span>
                  <span className="profile-detail-value">{selectedProfile.joinDate}</span>
                </div>
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Profile Status</span>
                  <span className="profile-detail-value">{selectedProfile.status}</span>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3 className="profile-section-title">Compensation Details</h3>
              <div className="profile-grid-list">
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Base Salary</span>
                  <span className="profile-detail-value">${selectedProfile.salary?.base.toLocaleString()}</span>
                </div>
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Allowances</span>
                  <span className="profile-detail-value">${selectedProfile.salary?.allowances.toLocaleString()}</span>
                </div>
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Deductions</span>
                  <span className="profile-detail-value">${selectedProfile.salary?.deductions.toLocaleString()}</span>
                </div>
                <div className="profile-detail-item" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                  <span className="profile-detail-label" style={{ fontWeight: 700 }}>Total Net Pay</span>
                  <span className="profile-detail-value" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    ${(selectedProfile.salary?.base + selectedProfile.salary?.allowances - selectedProfile.salary?.deductions).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3 className="profile-section-title">Active Shift Rota</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {Object.keys(selectedProfile.schedule || {}).map((day) => {
                  const shift = selectedProfile.schedule[day];
                  let dotClass = 'shift-morning';
                  if (shift === 'Afternoon') dotClass = 'shift-afternoon';
                  if (shift === 'Night') dotClass = 'shift-night';
                  if (shift === 'Off') dotClass = 'shift-off';
                  return (
                    <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.4rem', border: '1px solid var(--border)', borderRadius: '6px', background: 'rgba(255,255,255,0.01)' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>{day.slice(0,3)}</span>
                      <span className={`badge ${dotClass}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.3rem', marginTop: '0.25rem', width: '100%', justifyContent: 'center' }}>
                        {shift}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <button onClick={(e) => openEditModal(selectedProfile, e)} className="btn btn-primary" style={{ marginTop: 'auto' }}>
              <Edit size={16} />
              <span>Modify Details</span>
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {editingEmployee ? `Edit Profile: ${editingEmployee.name}` : 'Register New Employee'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="modal-close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Job Title / Role</label>
                  <input 
                    type="text" 
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    placeholder="e.g. Developer"
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="HR">HR</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@company.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="text" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Joining Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.joinDate}
                    onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Employment Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', marginTop: '1.25rem', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.85rem', fontWeight: 600 }}>Salary Package (USD / Monthly)</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Base Salary</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={formData.baseSalary}
                      onChange={(e) => setFormData({...formData, baseSalary: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Allowances</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={formData.allowances}
                      onChange={(e) => setFormData({...formData, allowances: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Deductions</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={formData.deductions}
                      onChange={(e) => setFormData({...formData, deductions: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label>Avatar Preset URL</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {PRESET_AVATARS.map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      alt="Avatar option"
                      onClick={() => setFormData({...formData, avatar: av})}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: formData.avatar === av ? '2px solid var(--primary)' : '2px solid transparent',
                        transform: formData.avatar === av ? 'scale(1.1)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEmployee ? 'Save Changes' : 'Register Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
