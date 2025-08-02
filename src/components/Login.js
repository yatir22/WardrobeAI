import React, { useState } from 'react';

const Login = ({ onLogin, setShowCreate }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!email && !username) || !password) {
      setError('Please enter your email or username and password.');
      return;
    }
    setError('');
    try {
      const res = await fetch('https://wardrobeai-backend.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      onLogin && onLogin(data.user);
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <div style={{ background: '#fff', padding: 36, borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', minWidth: 340 }}>
        <h2 style={{ color: '#1877f2', textAlign: 'center', marginBottom: 24, fontWeight: 700, fontSize: 32 }}>Wardrobe Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email address or Username"
            value={email || username}
            onChange={e => {
              // If input contains @, treat as email, else username
              if (e.target.value.includes('@')) {
                setEmail(e.target.value);
                setUsername('');
              } else {
                setUsername(e.target.value);
                setEmail('');
              }
            }}
            style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 6, border: '1px solid #ddd', fontSize: 16 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 6, border: '1px solid #ddd', fontSize: 16 }}
          />
          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
          <button type="submit" style={{ width: '100%', background: '#1877f2', color: '#fff', padding: 12, border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 18, marginBottom: 12 }}>Log In</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <span style={{ color: '#1877f2', cursor: 'pointer', fontWeight: 500 }} onClick={() => setShowCreate(true)}>Create new account</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
