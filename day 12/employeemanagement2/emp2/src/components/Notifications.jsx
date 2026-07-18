import React, { useState } from 'react';

export default function Notifications({ notifications, onMarkRead, onMarkAllRead }) {
  const [filter, setFilter] = useState('all');
  const types = ['all', 'leave', 'salary', 'attendance', 'employee', 'meeting'];

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>Notification Center</div>
          {unreadCount > 0 && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{unreadCount} unread notifications</div>}
        </div>
        {unreadCount > 0 && (
          <button onClick={onMarkAllRead} className="btn btn-ghost btn-sm">✅ Mark all as read</button>
        )}
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {types.map(type => (
          <button key={type} onClick={() => setFilter(type)}
            style={{
              padding: '7px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Inter',
              background: filter === type ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${filter === type ? '#6c63ff' : 'rgba(255,255,255,0.1)'}`,
              color: filter === type ? '#fff' : 'rgba(255,255,255,0.5)',
              textTransform: 'capitalize',
            }}>
            {type === 'all' ? '🔔 All' : type === 'leave' ? '🏖️ Leave' : type === 'salary' ? '💰 Salary' : type === 'attendance' ? '⏰ Attendance' : type === 'employee' ? '👤 Employee' : '📅 Meeting'}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔔</div>
            <div className="empty-state-text">No notifications</div>
            <div className="empty-state-sub">You're all caught up!</div>
          </div>
        ) : filtered.map(notif => (
          <div key={notif.id}
            onClick={() => onMarkRead(notif.id)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 16,
              padding: '18px 22px',
              background: notif.read ? 'rgba(255,255,255,0.03)' : 'rgba(108,99,255,0.07)',
              border: `1px solid ${notif.read ? 'rgba(255,255,255,0.06)' : 'rgba(108,99,255,0.2)'}`,
              borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s',
              position: 'relative',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.background = notif.read ? 'rgba(255,255,255,0.06)' : 'rgba(108,99,255,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = notif.read ? 'rgba(255,255,255,0.03)' : 'rgba(108,99,255,0.07)'; }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: getNotifBackground(notif.type),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, flexShrink: 0,
              border: `1px solid ${getNotifBorderColor(notif.type)}`,
            }}>{notif.icon}</div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{notif.title}</div>
                {!notif.read && (
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#6c63ff', flexShrink: 0 }} />
                )}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 6 }}>{notif.message}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🕐</span> {notif.time}
              </div>
            </div>

            {!notif.read && (
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: '#6c63ff', flexShrink: 0, marginTop: 4,
                boxShadow: '0 0 8px rgba(108,99,255,0.6)',
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function getNotifBackground(type) {
  const map = { leave: 'rgba(41,182,246,0.1)', salary: 'rgba(0,230,118,0.1)', attendance: 'rgba(255,167,38,0.1)', employee: 'rgba(108,99,255,0.1)', meeting: 'rgba(255,71,87,0.1)' };
  return map[type] || 'rgba(255,255,255,0.06)';
}
function getNotifBorderColor(type) {
  const map = { leave: 'rgba(41,182,246,0.2)', salary: 'rgba(0,230,118,0.2)', attendance: 'rgba(255,167,38,0.2)', employee: 'rgba(108,99,255,0.2)', meeting: 'rgba(255,71,87,0.2)' };
  return map[type] || 'rgba(255,255,255,0.1)';
}
