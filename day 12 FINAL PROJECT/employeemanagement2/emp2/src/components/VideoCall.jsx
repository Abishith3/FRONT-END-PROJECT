import React, { useState, useRef, useEffect } from 'react';
import { getInitials } from '../utils/helpers';

export default function VideoCall({ employees, callee: initialCallee }) {
  const [callState, setCallState] = useState('idle'); // idle | calling | connected | ended
  const [selectedEmployee, setSelectedEmployee] = useState(initialCallee || null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'system', text: 'Video call connected', time: '' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const timerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (initialCallee) {
      setSelectedEmployee(initialCallee);
    }
  }, [initialCallee]);

  useEffect(() => {
    if (callState === 'connected') {
      timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      if (callState !== 'connected') setCallDuration(0);
    }
    return () => clearInterval(timerRef.current);
  }, [callState]);

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCall = () => {
    if (!selectedEmployee) return;
    setCallState('calling');
    // Simulate connection after 2.5s
    setTimeout(() => setCallState('connected'), 2500);
  };

  const handleEndCall = () => {
    setCallState('ended');
    setTimeout(() => { setCallState('idle'); setCallDuration(0); }, 2000);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const now = new Date();
    setChatMessages(msgs => [
      ...msgs,
      { sender: 'you', text: chatInput.trim(), time: now.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setChatInput('');
    // Simulate reply
    setTimeout(() => {
      setChatMessages(msgs => [
        ...msgs,
        { sender: selectedEmployee?.name || 'Employee', text: getAutoReply(), time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1000 + Math.random() * 1500);
  };

  const getAutoReply = () => {
    const replies = ['Got it, thanks!', 'Sure, I\'ll look into it.', 'Sounds good!', 'Let me check and get back to you.', 'Acknowledged! 👍', 'Will do!'];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const buttonStyle = (active, color = '#fff') => ({
    width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
    transition: 'all 0.2s',
    background: active ? `${color}22` : 'rgba(255,255,255,0.1)',
    outline: active ? `2px solid ${color}` : 'none',
    color: active ? color : 'rgba(255,255,255,0.8)',
  });

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, height: 'calc(100vh - 140px)', minHeight: 600 }}>
      {/* Left panel - Contact list */}
      <div style={{
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 12 }}>Team Members</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, padding: '8px 12px',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>🔍</span>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search team..."
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 13, width: '100%', fontFamily: 'Inter' }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {filteredEmployees.map(emp => {
            const isSelected = selectedEmployee?.id === emp.id;
            const isOnline = emp.status === 'active';
            return (
              <div key={emp.id} onClick={() => callState === 'idle' || callState === 'ended' ? setSelectedEmployee(emp) : null}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 20px', cursor: 'pointer',
                  background: isSelected ? 'rgba(108,99,255,0.15)' : 'transparent',
                  borderLeft: isSelected ? '3px solid #6c63ff' : '3px solid transparent',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: emp.avatarColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, fontWeight: 700, color: '#fff',
                  }}>{getInitials(emp.name)}</div>
                  <div style={{
                    position: 'absolute', bottom: 1, right: 1,
                    width: 10, height: 10, borderRadius: '50%',
                    background: isOnline ? '#00e676' : '#666',
                    border: '2px solid #0d0f2b',
                  }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{emp.role}</div>
                </div>
                <div style={{ fontSize: 10, color: isOnline ? '#00e676' : 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>
                  {isOnline ? '● Online' : '● Away'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right panel - Call area */}
      <div style={{
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative',
      }}>

        {/* Idle state */}
        {(callState === 'idle' || callState === 'ended') && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 40 }}>
            {callState === 'ended' ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>📵</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Call Ended</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Duration: {formatDuration(callDuration)}</div>
              </div>
            ) : selectedEmployee ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 100, height: 100, borderRadius: '50%',
                  background: selectedEmployee.avatarColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 38, fontWeight: 700, color: '#fff',
                  margin: '0 auto 16px',
                  boxShadow: '0 0 40px rgba(108,99,255,0.4)',
                  animation: 'float 3s ease-in-out infinite',
                }}>{getInitials(selectedEmployee.name)}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{selectedEmployee.name}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{selectedEmployee.role} • {selectedEmployee.department}</div>
                <div style={{ fontSize: 13, color: '#00e676', marginBottom: 32 }}>● Available</div>
                <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <button onClick={handleCall}
                      style={{
                        width: 70, height: 70, borderRadius: '50%', border: 'none', cursor: 'pointer',
                        background: 'linear-gradient(135deg, #00e676, #00b050)',
                        fontSize: 28, color: '#000',
                        boxShadow: '0 0 30px rgba(0,230,118,0.4)',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >📹</button>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>Video Call</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <button
                      style={{
                        width: 70, height: 70, borderRadius: '50%', border: 'none', cursor: 'pointer',
                        background: 'linear-gradient(135deg, #6c63ff, #4a42d4)',
                        fontSize: 28, color: '#fff',
                        boxShadow: '0 0 30px rgba(108,99,255,0.4)',
                        transition: 'all 0.2s',
                      }}
                      onClick={handleCall}
                    >📞</button>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>Audio Call</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 72, marginBottom: 20, animation: 'float 3s ease-in-out infinite' }}>📹</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>NexaCorp Video Call</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Select a team member from the left to start a call</div>
              </div>
            )}
          </div>
        )}

        {/* Calling state */}
        {callState === 'calling' && selectedEmployee && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            <div style={{
              width: 120, height: 120, borderRadius: '50%',
              background: selectedEmployee.avatarColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 44, fontWeight: 700, color: '#fff',
              boxShadow: '0 0 0 0 rgba(0,230,118,0.7)',
              animation: 'pulse 1.5s infinite',
            }}>{getInitials(selectedEmployee.name)}</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>{selectedEmployee.name}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Calling...</div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 16 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 10, height: 10, borderRadius: '50%', background: '#6c63ff',
                    animation: `pulse 1.2s ${i * 0.4}s ease-in-out infinite`,
                  }} />
                ))}
              </div>
            </div>
            <button onClick={() => setCallState('idle')}
              style={{
                width: 64, height: 64, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #ff4757, #cc0015)',
                fontSize: 26, color: '#fff',
                boxShadow: '0 0 24px rgba(255,71,87,0.4)',
              }}>📵</button>
          </div>
        )}

        {/* Connected state */}
        {callState === 'connected' && selectedEmployee && (
          <>
            {/* Video area */}
            <div style={{ flex: 1, position: 'relative', background: '#0a0b1e', overflow: 'hidden' }}>
              {/* Remote "video" - animated gradient */}
              <div style={{
                width: '100%', height: '100%',
                background: `linear-gradient(135deg, ${selectedEmployee.avatarColor.match(/#[0-9a-f]+/gi)?.[0] || '#1a1b3a'}, #0a0b1e)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isCameraOff ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: 100, height: 100, borderRadius: '50%',
                      background: selectedEmployee.avatarColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 38, fontWeight: 700, color: '#fff', margin: '0 auto 12px',
                    }}>{getInitials(selectedEmployee.name)}</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Camera is off</div>
                  </div>
                ) : (
                  <div style={{
                    width: 120, height: 120, borderRadius: '50%',
                    background: selectedEmployee.avatarColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 46, fontWeight: 700, color: '#fff',
                    animation: 'float 3s ease-in-out infinite',
                    boxShadow: '0 0 60px rgba(108,99,255,0.3)',
                  }}>{getInitials(selectedEmployee.name)}</div>
                )}
              </div>

              {/* Participant name label */}
              <div style={{
                position: 'absolute', bottom: 16, left: 16,
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, color: '#fff',
              }}>{selectedEmployee.name}</div>

              {/* Duration */}
              <div style={{
                position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                padding: '6px 16px', borderRadius: 20, fontSize: 14, fontWeight: 700, color: '#00e676',
              }}>🔴 {formatDuration(callDuration)}</div>

              {/* Self video (PiP) */}
              <div style={{
                position: 'absolute', bottom: 16, right: 16,
                width: 140, height: 100, borderRadius: 12,
                background: 'linear-gradient(135deg, #1a1b3a, #2d2f5e)',
                border: '2px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}>
                {isCameraOff ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24 }}>📷</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Camera Off</div>
                  </div>
                ) : (
                  <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.6)' }}>👤</div>
                )}
                <div style={{
                  position: 'absolute', bottom: 4, left: 8,
                  fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600,
                }}>You</div>
              </div>

              {/* Screen share indicator */}
              {isScreenSharing && (
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'rgba(108,99,255,0.8)', padding: '6px 12px',
                  borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#fff',
                  backdropFilter: 'blur(8px)',
                }}>📺 Screen Sharing</div>
              )}
            </div>

            {/* Controls bar */}
            <div style={{
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
              background: 'rgba(0,0,0,0.3)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <button onClick={() => setIsMuted(m => !m)}
                  style={buttonStyle(isMuted, '#ff4757')}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >{isMuted ? '🔇' : '🎙️'}</button>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{isMuted ? 'Unmute' : 'Mute'}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <button onClick={() => setIsCameraOff(c => !c)}
                  style={buttonStyle(isCameraOff, '#ff4757')}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >{isCameraOff ? '📷' : '📸'}</button>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{isCameraOff ? 'Camera On' : 'Camera Off'}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <button onClick={() => setIsScreenSharing(s => !s)}
                  style={buttonStyle(isScreenSharing, '#6c63ff')}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >📺</button>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Screen</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <button onClick={() => setShowChat(c => !c)}
                  style={buttonStyle(showChat, '#00d4ff')}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >💬</button>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Chat</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <button onClick={handleEndCall}
                  style={{
                    width: 64, height: 64, borderRadius: '50%', border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #ff4757, #cc0015)',
                    fontSize: 28, color: '#fff',
                    boxShadow: '0 0 24px rgba(255,71,87,0.5)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >📵</button>
                <div style={{ fontSize: 10, color: '#ff4757', marginTop: 4 }}>End Call</div>
              </div>
            </div>
          </>
        )}

        {/* Chat panel */}
        {showChat && callState === 'connected' && (
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 280,
            background: 'rgba(13, 15, 43, 0.95)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>💬 Chat</div>
              <button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 18 }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{
                  textAlign: msg.sender === 'system' ? 'center' : msg.sender === 'you' ? 'right' : 'left',
                }}>
                  {msg.sender === 'system' ? (
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 20, display: 'inline-block' }}>{msg.text}</div>
                  ) : (
                    <div style={{
                      display: 'inline-block', maxWidth: '80%',
                      background: msg.sender === 'you' ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.07)',
                      border: `1px solid ${msg.sender === 'you' ? 'rgba(108,99,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: 12, padding: '8px 12px', textAlign: 'left',
                    }}>
                      <div style={{ fontSize: 13, color: '#fff' }}>{msg.text}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{msg.time}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8 }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'Inter',
                }}
              />
              <button onClick={handleSendMessage}
                style={{ background: 'linear-gradient(135deg, #6c63ff, #4a42d4)', border: 'none', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', color: '#fff', fontSize: 16 }}>
                ➤
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
