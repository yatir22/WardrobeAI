import React, { useState, useRef, useContext } from 'react';
import { UserContext } from '../App';

const UploadUserImage = ({ userImage, setUserImage }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef();
  const { user } = useContext(UserContext);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    formData.append('image', files[0]);
    
    // Get JWT token instead of userId
    const token = localStorage.getItem('token');
    console.log('🔍 Frontend Debug: User image upload token check:', token ? 'Token exists' : 'No token found');
    
    if (!token) {
      setUploadStatus('❌ Please log in again to upload.');
      setUploading(false);
      return;
    }

    setUploading(true);
    setUploadStatus('');
    
    try {
      const res = await fetch('http://localhost:5000/upload-user-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      const data = await res.json();
      if (res.ok && data.urls) {
        setUserImage(data.urls);
        setUploadStatus('✅ Image uploaded and metadata merged.');
      } else {
        setUploadStatus('❌ Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setUploadStatus('❌ Error uploading image.');
    } finally {
      setUploading(false);
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="card">
      <h2>Upload Your Photo(s)</h2>
      <label className="custom-upload-btn">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <span>📷 Choose Photo</span>
      </label>
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
      {uploadStatus && (
        <p style={{ color: uploadStatus.startsWith('✅') ? 'green' : 'red' }}>
          {uploadStatus}
        </p>
      )}
    </div>
  );
};

export default UploadUserImage;
