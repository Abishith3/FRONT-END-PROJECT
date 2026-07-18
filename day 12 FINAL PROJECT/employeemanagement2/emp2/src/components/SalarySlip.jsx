import React from 'react';
import { formatCurrency, formatDate, calculateSalaryBreakdown, generatePayslipNumber, getInitials } from '../utils/helpers';

export default function SalarySlip({ employee, month, year, onClose }) {
  const now = new Date();
  const slipMonth = month || now.getMonth() + 1;
  const slipYear = year || now.getFullYear();
  const salary = calculateSalaryBreakdown(employee.salary);
  const payslipNo = generatePayslipNumber(employee.id, slipMonth, slipYear);
  const monthName = new Date(slipYear, slipMonth - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const handlePrint = () => window.print();

  return (
    <div className="modal-overlay no-print">
      <div style={{
        background: '#fff',
        borderRadius: 20,
        width: '90%',
        maxWidth: 760,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 80px rgba(0,0,0,0.6)',
        fontFamily: 'Inter, sans-serif',
        color: '#1a1a2e',
      }}>
        {/* Print button bar */}
        <div className="no-print" style={{
          display: 'flex', justifyContent: 'flex-end', gap: 10,
          padding: '16px 24px',
          background: '#f8f9ff',
          borderRadius: '20px 20px 0 0',
          borderBottom: '1px solid #e8eaf6',
        }}>
          <button onClick={handlePrint} style={{
            padding: '8px 20px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #6c63ff, #4a42d4)',
            color: '#fff', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 600, fontSize: 14,
          }}>🖨️ Print / Download</button>
          <button onClick={onClose} style={{
            padding: '8px 20px', borderRadius: 10, border: '1px solid #e0e0e0',
            background: '#fff', color: '#666', cursor: 'pointer', fontFamily: 'Inter', fontSize: 14,
          }}>✕ Close</button>
        </div>

        {/* Payslip content */}
        <div id="salary-slip-content" style={{ padding: '36px 40px' }}>

          {/* Company Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 28, paddingBottom: 20,
            borderBottom: '3px solid #6c63ff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: 'linear-gradient(135deg, #6c63ff, #00d4ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, color: '#fff', fontWeight: 800,
              }}>⚡</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#1a1a2e', letterSpacing: '-0.5px' }}>NexaCorp Technologies</div>
                <div style={{ fontSize: 12, color: '#666' }}>12, Tech Park, Whitefield, Bangalore - 560066</div>
                <div style={{ fontSize: 12, color: '#666' }}>GST: 29AABCN1234F1Z5 | CIN: U72900KA2019PTC123456</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                background: 'linear-gradient(135deg, #6c63ff, #4a42d4)',
                color: '#fff', padding: '10px 20px', borderRadius: 12,
                fontSize: 16, fontWeight: 800, marginBottom: 4,
              }}>SALARY SLIP</div>
              <div style={{ fontSize: 12, color: '#888', textAlign: 'center' }}>Pay Period: {monthName}</div>
            </div>
          </div>

          {/* Payslip info */}
          <div style={{
            background: '#f8f9ff', borderRadius: 14, padding: '16px 20px',
            display: 'flex', justifyContent: 'space-between',
            marginBottom: 24, border: '1px solid #e8eaf6',
          }}>
            <div><span style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payslip No.</span><br />
              <strong style={{ fontSize: 13 }}>{payslipNo}</strong></div>
            <div><span style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Date</span><br />
              <strong style={{ fontSize: 13 }}>{new Date(slipYear, slipMonth - 1, 28).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></div>
            <div><span style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Mode</span><br />
              <strong style={{ fontSize: 13 }}>NEFT Transfer</strong></div>
            <div><span style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Working Days</span><br />
              <strong style={{ fontSize: 13 }}>22 days</strong></div>
          </div>

          {/* Employee Details */}
          <div style={{
            background: 'linear-gradient(135deg, #f0eeff, #e8f4ff)',
            borderRadius: 14, padding: '20px 24px',
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 16, marginBottom: 24,
            border: '1px solid #d4d0ff',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#6c63ff', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.7px' }}>Employee Details</div>
              {[
                ['Employee Name', employee.name],
                ['Employee ID', employee.id],
                ['Designation', employee.role],
                ['Department', employee.department],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#888', width: 130, flexShrink: 0 }}>{k}:</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e' }}>{v}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#6c63ff', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.7px' }}>Bank & Tax Details</div>
              {[
                ['Date of Joining', formatDate(employee.joinDate)],
                ['Location', employee.location],
                ['Bank Account', '****' + Math.floor(Math.random() * 9000 + 1000)],
                ['PAN No.', 'ABCDE' + employee.id.slice(-4) + 'F'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#888', width: 130, flexShrink: 0 }}>{k}:</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings & Deductions Table */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            {/* Earnings */}
            <div>
              <div style={{
                background: 'linear-gradient(135deg, #e8fff5, #f0fff8)',
                borderRadius: '12px 12px 0 0',
                padding: '12px 16px',
                border: '1px solid #b2f5d9',
                borderBottom: 'none',
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#00a854' }}>💚 EARNINGS</div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e0e0e0', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f9f9f9' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', color: '#555', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Component</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right', color: '#555', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Basic Salary', salary.earnings.basic],
                    ['House Rent Allowance', salary.earnings.hra],
                    ['Dearness Allowance', salary.earnings.da],
                    ['Transport Allowance', salary.earnings.ta],
                    ['Special Allowance', salary.earnings.special],
                  ].map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '10px 14px', color: '#333' }}>{k}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', color: '#1a1a2e', fontWeight: 600 }}>{formatCurrency(v)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: '#e8fff5', borderTop: '2px solid #00a854' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#00a854' }}>Gross Earnings</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: '#00a854', fontSize: 15 }}>{formatCurrency(salary.grossSalary)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Deductions */}
            <div>
              <div style={{
                background: 'linear-gradient(135deg, #fff5f5, #fff0f0)',
                borderRadius: '12px 12px 0 0',
                padding: '12px 16px',
                border: '1px solid #ffc0c0',
                borderBottom: 'none',
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e53935' }}>❤️ DEDUCTIONS</div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e0e0e0', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f9f9f9' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', color: '#555', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Component</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right', color: '#555', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Provident Fund (12%)', salary.deductions.pf],
                    ['Professional Tax', salary.deductions.professionalTax],
                    ['Income Tax (TDS)', salary.deductions.incomeTax],
                  ].map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '10px 14px', color: '#333' }}>{k}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', color: '#e53935', fontWeight: 600 }}>{formatCurrency(v)}</td>
                    </tr>
                  ))}
                  <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                    <td style={{ padding: '10px 14px', color: '#999' }}>Loan Deduction</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#999' }}>₹0</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr style={{ background: '#fff5f5', borderTop: '2px solid #e53935' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#e53935' }}>Total Deductions</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: '#e53935', fontSize: 15 }}>{formatCurrency(salary.totalDeductions)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Net Salary Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #6c63ff, #4a42d4)',
            borderRadius: 16, padding: '24px 32px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 24, color: '#fff',
          }}>
            <div>
              <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Net Take-Home Salary for {monthName}</div>
              <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-1px' }}>{formatCurrency(salary.netSalary)}</div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                In Words: {numberToWords(salary.netSalary)} Rupees Only
              </div>
            </div>
            <div style={{ textAlign: 'right', opacity: 0.85 }}>
              <div style={{ fontSize: 13 }}>Gross: {formatCurrency(salary.grossSalary)}</div>
              <div style={{ fontSize: 13 }}>Deductions: -{formatCurrency(salary.totalDeductions)}</div>
              <div style={{ fontSize: 13, marginTop: 6, padding: '4px 12px', background: 'rgba(255,255,255,0.2)', borderRadius: 20, display: 'inline-block' }}>
                Net = {formatCurrency(salary.netSalary)}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: 11, color: '#aaa', maxWidth: 360 }}>
              This is a computer-generated payslip and does not require a physical signature. For any discrepancies, please contact HR at hr@nexacorp.com
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 120, height: 1, background: '#333', marginBottom: 6 }} />
              <div style={{ fontSize: 11, color: '#555' }}>Authorized Signatory</div>
              <div style={{ fontSize: 11, color: '#888' }}>NexaCorp Technologies</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function numberToWords(num) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';
  if (num < 20) return ones[num];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
  return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWords(num % 10000000) : '');
}
