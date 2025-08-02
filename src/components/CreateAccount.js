import React, { useState } from 'react';

const CreateAccount = ({ onCreate, setShowCreate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);

  const checkUsername = async (uname) => {
    if (!uname) return;
    try {
      const res = await fetch(`https://wardrobeai-backend.onrender.com/check-username?username=${encodeURIComponent(uname)}`);
      const data = await res.json();
      setUsernameAvailable(data.available);
      setUsernameSuggestions(data.suggestions || []);
    } catch {
      setUsernameAvailable(null);
      setUsernameSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !username || !password) {
      setError('Please fill all fields.');
      return;
    }
    if (usernameAvailable === false) {
      setError('Username is not available.');
      return;
    }
    setError('');
    try {
      const res = await fetch('https://wardrobeai-backend.onrender.com/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Account creation failed');
        return;
      }
      onCreate && onCreate();
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <div style={{ background: '#fff', padding: 36, borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', minWidth: 340 }}>
        <h2 style={{ color: '#1877f2', textAlign: 'center', marginBottom: 24, fontWeight: 700, fontSize: 32 }}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 6, border: '1px solid #ddd', fontSize: 16 }}
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 6, border: '1px solid #ddd', fontSize: 16 }}
          />
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={e => { setUsername(e.target.value); setUsernameAvailable(null); }}
            onBlur={e => checkUsername(e.target.value)}
            style={{ width: '100%', padding: 12, marginBottom: 8, borderRadius: 6, border: '1px solid #ddd', fontSize: 16 }}
          />
          {usernameAvailable === false && (
            <div style={{ color: 'red', marginBottom: 8 }}>
              Username not available.
              {usernameSuggestions.length > 0 && (
                <div style={{ color: '#555', fontSize: 14, marginTop: 4 }}>
                  Suggestions: {usernameSuggestions.map(s => <span key={s} style={{ marginRight: 8 }}>{s}</span>)}
                </div>
              )}
            </div>
          )}
          {usernameAvailable === true && (
            <div style={{ color: 'green', marginBottom: 8 }}>Username available!</div>
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 6, border: '1px solid #ddd', fontSize: 16 }}
          />
          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
          <button type="submit" style={{ width: '100%', background: '#42b72a', color: '#fff', padding: 12, border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 18, marginBottom: 12 }} disabled={usernameAvailable === false}>Sign Up</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <span style={{ color: '#1877f2', cursor: 'pointer', fontWeight: 500 }} onClick={() => setShowCreate(false)}>Back to Login</span>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
