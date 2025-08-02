// Preview.js
import React, { useState } from 'react';

import { useContext } from 'react';
import { UserContext } from '../App';

function Preview({ userImage, selectedOutfit }) {
  const { user } = useContext(UserContext);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestedUrl, setSuggestedUrl] = useState(null);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestedReason, setSuggestedReason] = useState('');
  const [showSuggestedModal, setShowSuggestedModal] = useState(false);

  const handlePreview = async () => {
    let userImg = userImage?.[0];
    if (!userImg) {
      // Fetch a user image from Cloudinary for the logged-in user if not uploaded
      try {
        const userId = user?.id || user?._id;
        if (!userId) {
          alert('No user logged in. Please log in and upload a user photo.');
          return;
        }
        console.log(userId);
        const res = await fetch(`https://wardrobeai-backend.onrender.com/user-photos?userId=${userId}`);
        const data = await res.json();
        console.log(data.url);
        if (data.url) {
          userImg = data.url; // Use the first available user image for this user
        } else {
          alert('No user image found in Cloudinary for this user. Please upload a user photo.');
          return;
        }
      } catch (err) {
        alert('Error fetching user image from Cloudinary.');
        return;
      }
    }
    if (!userImg || !selectedOutfit?.[0]) {
      alert("Please upload a user photo and select an outfit.");
      return;
    }

    setLoading(true);
    setPreviewUrl(null);

    try {
      console.log("[DEBUG] Sending to /tryon:", {
        userImageUrl: userImg,
        clothImageUrl: selectedOutfit[0].url
      });
      const res = await fetch("https://wardrobeai-backend.onrender.com/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userImageUrl: userImg,
          clothImageUrl: selectedOutfit[0].url
        }),
      });

      // Handle non-JSON (image) or JSON error response
      const contentType = res.headers.get('content-type');
      console.log("[DEBUG] Response content-type:", contentType);
      if (contentType && contentType.startsWith('application/json')) {
        const data = await res.json();
        console.log("[DEBUG] Response JSON:", data);
        if (data?.previewUrl) {
          setPreviewUrl(data.previewUrl);
        } else {
          alert("Preview failed.");
        }
      } else if (contentType && contentType.startsWith('image/')) {
        // If backend ever returns image directly (not base64), handle it
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        console.log("[DEBUG] Received image blob, url:", url);
      } else {
        const text = await res.text();
        console.log("[DEBUG] Unexpected response text:", text);
        alert("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Preview error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestOutfit = async () => {
    setSuggesting(true);
    setSuggestedUrl(null);
    setSuggestedReason('');
    setShowSuggestedModal(false);
    try {
      const userId = user?.id || user?._id;
      if (!userId) {
        alert('User not logged in.');
        setSuggesting(false);
        return;
      }
      // Only send userId to backend, backend will fetch features and clothes
      const aiRes = await fetch('https://wardrobeai-backend.onrender.com/suggest-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const aiData = await aiRes.json();
      if (aiData && aiData.suggestedClothUrl) {
        setSuggestedUrl(aiData.suggestedClothUrl);
        setSuggestedReason(aiData.reason || '');
        setShowSuggestedModal(true);
      } else {
        alert('No suggestion received from AI.');
      }
    } catch (err) {
      alert('Error suggesting outfit.');
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 32, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#2d3a4a' }}>Preview Selection</h2>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, gap: 16 }}>
        <button
          onClick={handlePreview}
          disabled={loading}
          style={{
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 32px',
            fontSize: 18,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.2s',
          }}
        >
          {loading ? (
            <span>Generating...</span>
          ) : (
            <span>👗 Try-On with AI</span>
          )}
        </button>
        <button
          onClick={handleSuggestOutfit}
          disabled={suggesting}
          style={{
            background: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 32px',
            fontSize: 18,
            fontWeight: 600,
            cursor: suggesting ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            opacity: suggesting ? 0.7 : 1,
            transition: 'all 0.2s',
          }}
        >
          {suggesting ? 'Suggesting...' : '✨ Suggest Outfit'}
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 160, textAlign: 'center' }}>
          <h4 style={{ color: '#555', marginBottom: 12 }}>User Image</h4>
          {userImage?.[0] ? (
            <div style={{ width: 200, height: 200, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', border: '2px solid #eee', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: '#fff' }}>
              <img src={userImage[0]} style={{ width: '100%', height: 'auto', maxHeight: 200, objectFit: 'contain', objectPosition: 'top' }} />
            </div>
          ) : (
            <div style={{ width: 200, height: 200, borderRadius: 16, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 14 }}>No Image</div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 160, textAlign: 'center' }}>
          <h4 style={{ color: '#555', marginBottom: 12 }}>Cloth Selected</h4>
          {selectedOutfit?.[0]?.url ? (
            <img src={selectedOutfit[0].url} style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.10)', border: '2px solid #eee' }} />
          ) : (
            <div style={{ width: 200, height: 200, borderRadius: 16, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 14 }}>No Outfit</div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 200, textAlign: 'center' }}>
          <h4 style={{ color: '#555', marginBottom: 12 }}>Preview Result</h4>
          {previewUrl ? (
            <img src={previewUrl} style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.13)', border: '2px solid #007bff' }} />
          ) : (
            <div style={{ width: 200, height: 200, borderRadius: 16, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 16 }}>No Preview</div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 200, textAlign: 'center' }}>
          <h4 style={{ color: '#555', marginBottom: 12 }}>Suggested Outfit</h4>
          {suggestedUrl && !showSuggestedModal ? (
            <img src={suggestedUrl} style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.13)', border: '2px solid #28a745' }} />
          ) : (
            <div style={{ width: 200, height: 200, borderRadius: 16, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 16 }}>No Suggestion</div>
          )}
        </div>
      </div>
      {/* Modal for suggested outfit */}
      {showSuggestedModal && suggestedUrl && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', textAlign: 'center', position: 'relative', minWidth: 320 }}>
            <button onClick={() => setShowSuggestedModal(false)} style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', fontSize: 28, color: '#888', cursor: 'pointer', fontWeight: 700 }}>×</button>
            <h2 style={{ color: '#28a745', marginBottom: 18 }}>✨ AI Suggested Outfit</h2>
            <img src={suggestedUrl} style={{ width: 260, height: 260, objectFit: 'cover', borderRadius: 18, boxShadow: '0 4px 16px rgba(0,0,0,0.13)', border: '2px solid #28a745', marginBottom: 18 }} />
            {suggestedReason && (
              <div style={{
                background: 'linear-gradient(90deg, #e0ffe7 0%, #f8fff8 100%)',
                color: '#1b5e20',
                borderRadius: 12,
                padding: '16px 18px',
                fontSize: 18,
                fontWeight: 500,
                margin: '0 auto',
                maxWidth: 340,
                boxShadow: '0 2px 8px rgba(40,167,69,0.08)',
                marginTop: 8
              }}>
                <span style={{ fontSize: 22, marginRight: 8 }}>💡</span>{suggestedReason}
              </div>
            )}
          </div>
        </div>
      )}
      {(loading || suggesting) && (
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
            <div style={{ fontSize: 20, color: '#333' }}>{loading ? 'Generating Try-On... Please wait' : 'Suggesting Outfit... Please wait'}</div>
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
    </div>
  );
}

export default Preview;
