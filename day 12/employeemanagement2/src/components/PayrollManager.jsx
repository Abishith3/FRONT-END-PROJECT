import React, { useState, useContext } from 'react';
import { EmployeeContext } from '../context/EmployeeContext';
import { 
  CircleDollarSign, 
  ChevronRight, 
  ChevronDown, 
  Printer, 
  Download, 
  History,
  Receipt,
  Sparkles,
  X
} from 'lucide-react';

export default function PayrollManager() {
  const { employees, payrollHistory, processPayrollForMonth } = useContext(EmployeeContext);
  
  const [selectedMonth, setSelectedMonth] = useState('July 2026');
  const [viewingPayslip, setViewingPayslip] = useState(null); // { employee, payrollInfo, month }
  const [expandedRun, setExpandedRun] = useState(null); // ID of historical run expanded
  const [successMessage, setSuccessMessage] = useState('');

  // Calculations for current period (simulated)
  const currentDetails = employees.map(emp => {
    const base = emp.salary?.base || 0;
    const allowances = emp.salary?.allowances || 0;
    const deductions = emp.salary?.deductions || 0;
    const net = base + allowances - deductions;
    return {
      id: emp.id,
      name: emp.name,
      role: emp.role,
      department: emp.department,
      base,
      allowances,
      deductions,
      net
    };
  });

  const currentSummary = {
    totalBase: currentDetails.reduce((sum, d) => sum + d.base, 0),
    totalAllowances: currentDetails.reduce((sum, d) => sum + d.allowances, 0),
    totalDeductions: currentDetails.reduce((sum, d) => sum + d.deductions, 0),
    totalNet: currentDetails.reduce((sum, d) => sum + d.net, 0)
  };

  const handleProcessPayroll = () => {
    const success = processPayrollForMonth(selectedMonth);
    if (success) {
      setSuccessMessage(`Payroll for ${selectedMonth} processed and archived successfully!`);
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      alert(`Payroll for ${selectedMonth} has already been processed.`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const triggerOpenPayslip = (empId, source = 'current', histRun = null) => {
    const employee = employees.find(e => e.id === empId);
    if (!employee) return;

    let payrollInfo;
    let monthName = selectedMonth;

    if (source === 'current') {
      payrollInfo = {
        base: employee.salary.base,
        allowances: employee.salary.allowances,
        deductions: employee.salary.deductions,
        net: employee.salary.base + employee.salary.allowances - employee.salary.deductions
      };
    } else if (source === 'history' && histRun) {
      const details = histRun.details.find(d => d.employeeId === empId);
      monthName = histRun.month;
      payrollInfo = {
        base: details.base,
        allowances: details.allowances,
        deductions: details.deductions,
        net: details.net
      };
    }

    setViewingPayslip({
      employee,
      payrollInfo,
      month: monthName,
      dateProcessed: histRun ? histRun.processedDate : new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Salary & Payroll</h1>
          <p className="section-subtitle">Process monthly compensation packages, review metrics, and generate payslips.</p>
        </div>
      </div>

      {/* Summary Metrics Bar */}
      <div className="payroll-summary-bar">
        <div className="payroll-summary-card">
          <span className="payroll-summary-label">Estimated Base Salaries</span>
          <span className="payroll-summary-value" style={{ color: 'var(--text-main)' }}>
            ${currentSummary.totalBase.toLocaleString()}
          </span>
        </div>
        <div className="payroll-summary-card">
          <span className="payroll-summary-label">Estimated Allowances</span>
          <span className="payroll-summary-value" style={{ color: '#10b981' }}>
            +${currentSummary.totalAllowances.toLocaleString()}
          </span>
        </div>
        <div className="payroll-summary-card">
          <span className="payroll-summary-label">Estimated Deductions</span>
          <span className="payroll-summary-value" style={{ color: '#fb7185' }}>
            -${currentSummary.totalDeductions.toLocaleString()}
          </span>
        </div>
        <div className="payroll-summary-card" style={{ borderColor: 'rgba(99, 102, 241, 0.2)' }}>
          <span className="payroll-summary-label" style={{ color: 'var(--primary)' }}>Estimated Total Net Payout</span>
          <span className="payroll-summary-value" style={{ color: 'var(--primary)', textShadow: '0 0 10px rgba(99,102,241,0.2)' }}>
            ${currentSummary.totalNet.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Process Payroll Widget */}
      <div className="payroll-header-actions glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Sparkles size={18} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Period Processing:</span>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
          >
            <option value="July 2026">July 2026 (Active)</option>
            <option value="August 2026">August 2026</option>
            <option value="September 2026">September 2026</option>
          </select>
        </div>

        <button onClick={handleProcessPayroll} className="btn btn-primary">
          <CircleDollarSign size={16} />
          <span>Lock & Process Payroll</span>
        </button>
      </div>

      {successMessage && (
        <div 
          className="glass-panel" 
          style={{ 
            padding: '0.85rem 1.25rem', 
            marginBottom: '1.5rem', 
            borderColor: 'rgba(16, 185, 129, 0.25)', 
            background: 'rgba(16, 185, 129, 0.08)',
            color: '#34d399',
            fontSize: '0.9rem',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          {successMessage}
        </div>
      )}

      {/* Salary Overview Sheet */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Active Pay Sheet</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Base Pay</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentDetails.map((det) => (
                <tr key={det.id}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{det.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{det.role} • ID: {det.id}</span>
                    </div>
                  </td>
                  <td>${det.base.toLocaleString()}</td>
                  <td style={{ color: '#10b981' }}>+${det.allowances.toLocaleString()}</td>
                  <td style={{ color: '#fb7185' }}>-${det.deductions.toLocaleString()}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>${det.net.toLocaleString()}</td>
                  <td>
                    <button 
                      onClick={() => triggerOpenPayslip(det.id, 'current')}
                      className="btn btn-secondary" 
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <Receipt size={13} />
                      Payslip View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Logs */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={16} style={{ color: 'var(--text-muted)' }} /> Historical Auditing Pipeline
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {payrollHistory.map((run) => {
            const isExpanded = expandedRun === run.id;
            return (
              <div key={run.id} className="glass-panel" style={{ padding: '1rem' }}>
                <div 
                  onClick={() => setExpandedRun(isExpanded ? null : run.id)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    <div>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>{run.month} Payroll Run</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Processed on {run.processedDate} • {run.totalEmployees} employees
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Payout</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                        ${run.totalNet.toLocaleString()}
                      </span>
                    </div>
                    <span className="badge badge-present" style={{ fontSize: '0.65rem' }}>Paid</span>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', animation: 'fadeIn 0.3s ease' }}>
                    <div className="table-container" style={{ background: 'rgba(0,0,0,0.1)' }}>
                      <table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Base</th>
                            <th>Allowances</th>
                            <th>Deductions</th>
                            <th>Net Payout</th>
                            <th>View</th>
                          </tr>
                        </thead>
                        <tbody>
                          {run.details.map((det) => (
                            <tr key={det.employeeId}>
                              <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{det.name}</td>
                              <td>${det.base.toLocaleString()}</td>
                              <td style={{ color: '#10b981' }}>+${det.allowances.toLocaleString()}</td>
                              <td style={{ color: '#fb7185' }}>-${det.deductions.toLocaleString()}</td>
                              <td style={{ fontWeight: 700 }}>${det.net.toLocaleString()}</td>
                              <td>
                                <button 
                                  onClick={() => triggerOpenPayslip(det.employeeId, 'history', run)}
                                  className="btn btn-secondary" 
                                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                                >
                                  Invoice
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice Payslip Modal View */}
      {viewingPayslip && (
        <div className="modal-overlay" onClick={() => setViewingPayslip(null)}>
          <div className="modal-content" style={{ maxWidth: '680px', padding: '1.5rem' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ marginBottom: '0.75rem', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Payslip Invoice Preview</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handlePrint} className="action-btn-sm" title="Print Invoice" style={{ padding: '0.35rem' }}>
                  <Printer size={15} />
                </button>
                <button onClick={() => setViewingPayslip(null)} className="modal-close">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Print Container Wrapper (resets background to look like a clean page invoice) */}
            <div className="payslip-modal-body">
              <div className="payslip-invoice">
                <div className="payslip-invoice-header">
                  <div className="company-brand">
                    <span className="company-title">ORBIT CORP LTD.</span>
                    <span className="company-address">100 Innovation Way, Suite 400</span>
                    <span className="company-address">Silicon Valley, CA 94025</span>
                  </div>
                  <div className="invoice-meta">
                    <span className="invoice-title">Payslip</span>
                    <span className="invoice-number">PERIOD: {viewingPayslip.month.toUpperCase()}</span>
                    <span className="invoice-number" style={{ fontSize: '0.75rem' }}>PAY DATE: {viewingPayslip.dateProcessed}</span>
                  </div>
                </div>

                <div className="payslip-details-grid">
                  <div className="payslip-meta-col">
                    <div className="payslip-meta-row">
                      <span className="payslip-meta-label">Employee ID</span>
                      <span className="payslip-meta-val">{viewingPayslip.employee.id}</span>
                    </div>
                    <div className="payslip-meta-row">
                      <span className="payslip-meta-label">Full Name</span>
                      <span className="payslip-meta-val">{viewingPayslip.employee.name}</span>
                    </div>
                    <div className="payslip-meta-row">
                      <span className="payslip-meta-label">Job Title</span>
                      <span className="payslip-meta-val">{viewingPayslip.employee.role}</span>
                    </div>
                  </div>

                  <div className="payslip-meta-col">
                    <div className="payslip-meta-row">
                      <span className="payslip-meta-label">Department</span>
                      <span className="payslip-meta-val">{viewingPayslip.employee.department}</span>
                    </div>
                    <div className="payslip-meta-row">
                      <span className="payslip-meta-label">Pay Method</span>
                      <span className="payslip-meta-val">Direct Deposit</span>
                    </div>
                    <div className="payslip-meta-row">
                      <span className="payslip-meta-label">Email Address</span>
                      <span className="payslip-meta-val" style={{ fontSize: '0.75rem' }}>{viewingPayslip.employee.email}</span>
                    </div>
                  </div>
                </div>

                <div className="payslip-table-wrapper">
                  <table className="payslip-table">
                    <thead>
                      <tr>
                        <th>Earnings Description</th>
                        <th style={{ textAlign: 'right' }}>Amount (USD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Monthly Base Salary</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>
                          ${viewingPayslip.payrollInfo.base.toLocaleString()}.00
                        </td>
                      </tr>
                      <tr>
                        <td>Travel & Allowance Benefits</td>
                        <td style={{ textAlign: 'right', fontWeight: 600, color: '#16a34a' }}>
                          +${viewingPayslip.payrollInfo.allowances.toLocaleString()}.00
                        </td>
                      </tr>
                      <tr style={{ height: '10px' }} />
                      <tr>
                        <th>Deductions Description</th>
                        <th style={{ textAlign: 'right' }}>Amount (USD)</th>
                      </tr>
                      <tr>
                        <td>Provident Fund & Deductions (Medicare/Tax)</td>
                        <td style={{ textAlign: 'right', fontWeight: 600, color: '#dc2626' }}>
                          -${viewingPayslip.payrollInfo.deductions.toLocaleString()}.00
                        </td>
                      </tr>
                      <tr className="total-row">
                        <td style={{ fontWeight: 700 }}>Total Net Deposited Pay</td>
                        <td style={{ textAlign: 'right', fontWeight: 800, color: '#4f46e5', fontSize: '1.05rem' }}>
                          ${viewingPayslip.payrollInfo.net.toLocaleString()}.00
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="payslip-footer-notes">
                  This payslip is a system-generated document. For any payroll inquiries, please contact the HR Finance team.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button onClick={() => setViewingPayslip(null)} className="btn btn-secondary">
                Close Preview
              </button>
              <button onClick={handlePrint} className="btn btn-primary">
                <Printer size={16} />
                <span>Print Payslip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
