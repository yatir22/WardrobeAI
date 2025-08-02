import React, { useState, createContext } from 'react';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import UploadUserImage from './components/UploadUserImage';
import UploadClothes from './components/UploadClothes';
import Preview from './components/Preview';
import OutfitSelector from './components/OutfitSelector';
import Tabs from './components/Tabs';
import './App.css';
import { useEffect } from 'react';

export const UserContext = createContext();

function App() {
  const [activeTab, setActiveTab] = useState('photo');
  const [darkMode, setDarkMode] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [clothes, setClothes] = useState([]);
  const [selectedOutfit, setSelectedOutfit] = useState([]);
  const [user, setUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Auto-login if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      // Fetch user info from backend using token
      fetch('http://localhost:5000/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data._id) {
            setUser(data);
          } else {
            localStorage.removeItem('token');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, [user]);

  const renderTab = () => {
    switch (activeTab) {
      case 'photo':
        return <UploadUserImage userImage={userImage} setUserImage={setUserImage} />;
      case 'clothes':
        return <UploadClothes clothes={clothes} setClothes={setClothes} />;
      case 'outfit':
        return (
          <OutfitSelector
            clothes={clothes}
            selectedOutfit={selectedOutfit}
            setSelectedOutfit={setSelectedOutfit}
          />
        );
      case 'preview':
        return <Preview userImage={userImage} selectedOutfit={selectedOutfit} />;
      default:
        return null;
    }
  };

  if (!user) {
    if (createSuccess) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
          <div style={{ background: '#fff', padding: 36, borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', minWidth: 340, textAlign: 'center' }}>
            <h2 style={{ color: '#42b72a', marginBottom: 24 }}>Account created successfully!</h2>
            <button style={{ background: '#1877f2', color: '#fff', padding: 12, border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 18 }}
              onClick={() => { setCreateSuccess(false); setShowCreate(false); }}>
              Go to Login
            </button>
          </div>
        </div>
      );
    }
    return showCreate ? (
      <CreateAccount onCreate={() => setCreateSuccess(true)} setShowCreate={setShowCreate} />
    ) : (
      <Login onLogin={user => setUser(user)} setShowCreate={setShowCreate} />
    );
  }

  const handleLogout = () => {
    setUser(null);
    setShowProfileMenu(false);
    setUserImage(null);
    setClothes([]);
    setSelectedOutfit([]);
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className={`App${darkMode ? ' dark' : ''}`}>
        <header className="app-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 className="app-title">My AI Wardrobe</h1>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative', gap: 0 }}>
            <span style={{ marginRight: 12, fontWeight: 600 }}>{user.username}</span>
            <div
              style={{ width: 36, height: 36, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 20 }}
              onClick={() => setShowProfileMenu(v => !v)}
            >
              <span role="img" aria-label="profile">👤</span>
            </div>
            {showProfileMenu && (
              <div style={{ position: 'absolute', top: 44, right: 40, background: '#fff', border: '1px solid #ddd', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', zIndex: 10 }}>
                <div
                  style={{ padding: '12px 24px', cursor: 'pointer', color: '#d00', fontWeight: 500 }}
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            )}
            <button className="toggle" style={{ marginLeft: 8 }} onClick={() => setDarkMode(prev => !prev)}>
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </header>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="tab-content">
          {renderTab()}
        </main>
      </div>
    </UserContext.Provider>
  );
}

export default App;
