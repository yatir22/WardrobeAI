// UploadClothes.js
import React, { useState, useRef, useContext } from 'react';
import { UserContext } from '../App';

const UploadClothes = ({ clothes, setClothes }) => {
  const [category, setCategory] = useState('top');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef();
  const { user } = useContext(UserContext);

  const handleCategoryChange = (e) => setCategory(e.target.value);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    formData.append('image', files[0]);
    // Add userId to formData
    const userId = user?._id || user?.id;
    if (!userId) {
      setMessage('❌ User ID missing. Please log in again.');
      setUploading(false);
      return;
    }
    formData.append('userId', userId);

    setUploading(true);
    setMessage('');
    try {
      const res = await fetch(`https://wardrobeai-backend.onrender.com/upload?category=${category}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
    if (data.secure_url) {
      const tagged = { url: data.url, category };
      setClothes(prev => [...prev, tagged]);
      setMessage('✅ Upload successful!');
    } else {
      setMessage('❌ No image URL returned.');
    }
    } catch (err) {
      console.error('Upload error:', err);
      setMessage('❌ Upload failed.');
    } finally {
      setUploading(false);
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="card" style={{ position: 'relative' }}>
      {uploading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.35)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', textAlign: 'center' }}>
            <div className="rainbow-spinner" style={{ margin: '0 auto 22px auto' }}></div>
            <div style={{ fontSize: 20, color: '#333' }}>Uploading... Please wait</div>
          </div>
          <style>{`
            .rainbow-spinner {
              width: 48px;
              height: 48px;
              border-radius: 50%;
              border: 6px solid #FF5252;
              border-top: 6px solid #FF9800;
              border-right: 6px solid #4CAF50;
              border-bottom: 6px solid #00BCD4;
              border-left: 6px solid #E040FB;
              animation: rainbow-spin 1s linear infinite;
              box-shadow: 0 2px 12px #FF525233;
            }
            @keyframes rainbow-spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      <h2>Upload Clothes</h2>
      <div className="category-radio-group">
        {['top', 'bottom', 'dress'].map((cat) => (
          <label key={cat} className="category-radio">
            <input
              type="radio"
              value={cat}
              checked={category === cat}
              onChange={handleCategoryChange}
            />
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </label>
        ))}
      </div>

      <label className="custom-upload-btn">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <span>👕 Upload {category.charAt(0).toUpperCase() + category.slice(1)} Image(s)</span>
      </label>

      {uploading && <p>Uploading...</p>}
      {message && <p style={{ color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

export default UploadClothes;
