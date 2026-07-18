import React, { useState, useEffect } from 'react';

const USERS = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'Super Admin', avatar: '👑' },
  { username: 'hr.admin', password: 'hr1234', role: 'admin', name: 'HR Admin', avatar: '🛡️' },
  { username: 'aarav.sharma', password: 'emp123', role: 'employee', name: 'Aarav Sharma', empId: 'EMP001', avatar: '👤' },
  { username: 'priya.nair', password: 'emp123', role: 'employee', name: 'Priya Nair', empId: 'EMP002', avatar: '👤' },
  { username: 'rohan.mehta', password: 'emp123', role: 'employee', name: 'Rohan Mehta', empId: 'EMP003', avatar: '👤' },
];

export default function Login({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const [shake, setShake] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const pts = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 20 + 15,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setParticles(pts);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 900));

    const user = USERS.find(
      u => u.username === username.trim().toLowerCase() &&
        u.password === password &&
        u.role === selectedRole
    );

    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError('');
    setUsername('');
    setPassword('');
    if (role === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('aarav.sharma');
      setPassword('emp123');
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Animated Background */}
      <div style={styles.bg}>
        <div style={styles.orb1} />
        <div style={styles.orb2} />
        <div style={styles.orb3} />
        {particles.map(p => (
          <div key={p.id} style={{
            ...styles.particle,
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `floatParticle ${p.speed}s ${p.delay}s infinite ease-in-out alternate`,
          }} />
        ))}
        <div style={styles.grid} />
      </div>

      {/* Login Card */}
      <div style={{
        ...styles.card,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)',
        transition: 'all 0.7s cubic-bezier(0.34,1.56,0.64,1)',
        ...(shake ? { animation: 'shake 0.5s ease' } : {}),
      }}>

        {/* Logo / Brand */}
        <div style={styles.brand}>
          <div style={styles.logoWrap}>
            <span style={styles.logoIcon}>⚡</span>
          </div>
          <h1 style={styles.brandName}>EmpowerHR</h1>
          <p style={styles.brandTagline}>Next-Gen Employee Management</p>
        </div>

        {!selectedRole ? (
          /* Role Selection */
          <div style={styles.roleSection}>
            <p style={styles.roleTitle}>Sign in as</p>
            <div style={styles.roleCards}>
              <button style={styles.roleCard} onClick={() => handleRoleSelect('admin')}>
                <div style={{ ...styles.roleIconWrap, background: 'linear-gradient(135deg,#6c63ff,#a855f7)' }}>
                  <span style={styles.roleEmoji}>🛡️</span>
                </div>
                <div>
                  <p style={styles.roleCardTitle}>Administrator</p>
                  <p style={styles.roleCardDesc}>Full system access</p>
                </div>
                <span style={styles.roleArrow}>›</span>
              </button>
              <button style={styles.roleCard} onClick={() => handleRoleSelect('employee')}>
                <div style={{ ...styles.roleIconWrap, background: 'linear-gradient(135deg,#00d4ff,#0099cc)' }}>
                  <span style={styles.roleEmoji}>👤</span>
                </div>
                <div>
                  <p style={styles.roleCardTitle}>Employee</p>
                  <p style={styles.roleCardDesc}>Self-service portal</p>
                </div>
                <span style={styles.roleArrow}>›</span>
              </button>
            </div>
            <div style={styles.demoHint}>
              <span style={styles.demoIcon}>💡</span>
              <span>Demo accounts auto-fill on role selection</span>
            </div>
          </div>
        ) : (
          /* Login Form */
          <div>
            {/* Back + Role badge */}
            <div style={styles.formHeader}>
              <button style={styles.backBtn} onClick={() => setSelectedRole(null)}>
                ← Back
              </button>
              <div style={{
                ...styles.roleBadge,
                background: selectedRole === 'admin'
                  ? 'linear-gradient(135deg,rgba(108,99,255,0.2),rgba(168,85,247,0.2))'
                  : 'linear-gradient(135deg,rgba(0,212,255,0.2),rgba(0,153,204,0.2))',
                borderColor: selectedRole === 'admin' ? 'rgba(108,99,255,0.4)' : 'rgba(0,212,255,0.4)',
              }}>
                <span>{selectedRole === 'admin' ? '🛡️' : '👤'}</span>
                <span style={{ color: selectedRole === 'admin' ? '#8b85ff' : '#00d4ff' }}>
                  {selectedRole === 'admin' ? 'Admin Portal' : 'Employee Portal'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Username */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Username</label>
                <div style={styles.inputWrap}>
                  <span style={styles.inputIcon}>👤</span>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter username"
                    style={styles.input}
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrap}>
                  <span style={styles.inputIcon}>🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    style={{ ...styles.input, paddingRight: 48 }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    style={styles.eyeBtn}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={styles.errorBox}>
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitBtn,
                  background: selectedRole === 'admin'
                    ? 'linear-gradient(135deg,#6c63ff,#a855f7)'
                    : 'linear-gradient(135deg,#00d4ff,#0099cc)',
                  opacity: loading ? 0.8 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <span style={styles.spinner} />
                ) : (
                  `Sign in to ${selectedRole === 'admin' ? 'Admin' : 'Employee'} Portal →`
                )}
              </button>
            </form>

            {/* Demo credentials hint */}
            <div style={styles.demoBox}>
              <p style={styles.demoTitle}>
                {selectedRole === 'admin' ? '🛡️ Admin Credentials' : '👤 Employee Credentials'}
              </p>
              {selectedRole === 'admin' ? (
                <div style={styles.demoGrid}>
                  <span style={styles.demoItem}><b>admin</b> / admin123</span>
                  <span style={styles.demoItem}><b>hr.admin</b> / hr1234</span>
                </div>
              ) : (
                <div style={styles.demoGrid}>
                  <span style={styles.demoItem}><b>aarav.sharma</b> / emp123</span>
                  <span style={styles.demoItem}><b>priya.nair</b> / emp123</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes floatParticle {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          100% { transform: translateY(-30px) translateX(15px) rotate(180deg); }
        }
        @keyframes orbPulse {
          0%,100% { transform: scale(1) translate(0,0); opacity:0.6; }
          50% { transform: scale(1.15) translate(20px,-20px); opacity:0.9; }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input:focus {
          outline: none !important;
          border-color: rgba(108,99,255,0.6) !important;
          box-shadow: 0 0 0 3px rgba(108,99,255,0.15) !important;
          background: rgba(255,255,255,0.08) !important;
        }
        button.role-card-btn:hover {
          transform: translateX(4px);
          background: rgba(255,255,255,0.08) !important;
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#060818',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'Inter, sans-serif',
    padding: '20px',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  orb1: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(108,99,255,0.25) 0%, transparent 70%)',
    top: '-100px',
    left: '-100px',
    animation: 'orbPulse 8s ease-in-out infinite',
  },
  orb2: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,212,255,0.2) 0%, transparent 70%)',
    bottom: '-80px',
    right: '-80px',
    animation: 'orbPulse 10s 2s ease-in-out infinite',
  },
  orb3: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
    top: '40%',
    left: '60%',
    animation: 'orbPulse 12s 4s ease-in-out infinite',
  },
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
  },
  particle: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(108,99,255,0.8)',
  },
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: 460,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: '40px 36px',
    backdropFilter: 'blur(24px)',
    boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
  },
  brand: {
    textAlign: 'center',
    marginBottom: 32,
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 14px',
    boxShadow: '0 8px 32px rgba(108,99,255,0.4)',
  },
  logoIcon: { fontSize: 28 },
  brandName: {
    fontSize: 26,
    fontWeight: 800,
    color: '#fff',
    margin: '0 0 4px',
    background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  brandTagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    margin: 0,
  },
  roleSection: {},
  roleTitle: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  roleCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  roleCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: '16px 20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    color: '#fff',
    width: '100%',
    ':hover': {
      background: 'rgba(255,255,255,0.08)',
    },
  },
  roleIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  roleEmoji: { fontSize: 22 },
  roleCardTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 2px',
  },
  roleCardDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    margin: 0,
  },
  roleArrow: {
    marginLeft: 'auto',
    fontSize: 22,
    color: 'rgba(255,255,255,0.3)',
  },
  demoHint: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    padding: '10px 16px',
    background: 'rgba(108,99,255,0.08)',
    border: '1px solid rgba(108,99,255,0.15)',
    borderRadius: 10,
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
  },
  demoIcon: { fontSize: 14 },
  formHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.45)',
    cursor: 'pointer',
    fontSize: 13,
    padding: '4px 0',
    transition: 'color 0.2s',
  },
  roleBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 12px',
    border: '1px solid',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.5,
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    fontSize: 16,
    pointerEvents: 'none',
    zIndex: 1,
  },
  input: {
    width: '100%',
    padding: '13px 16px 13px 44px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
    padding: 4,
    color: 'rgba(255,255,255,0.4)',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    background: 'rgba(255,71,87,0.1)',
    border: '1px solid rgba(255,71,87,0.3)',
    borderRadius: 10,
    color: '#ff6b7a',
    fontSize: 13,
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    letterSpacing: 0.3,
    boxShadow: '0 4px 20px rgba(108,99,255,0.3)',
    transition: 'all 0.2s ease',
  },
  spinner: {
    width: 20,
    height: 20,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },
  demoBox: {
    marginTop: 20,
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12,
  },
  demoTitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    margin: '0 0 8px',
    fontWeight: 600,
  },
  demoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  demoItem: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    fontFamily: 'monospace',
  },
};
