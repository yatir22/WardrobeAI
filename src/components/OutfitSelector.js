import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../App';

const OutfitSelector = ({ selectedOutfit, setSelectedOutfit }) => {
  const [modalImg, setModalImg] = useState(null);
  const [clothes, setClothes] = useState([]);
  const { user } = useContext(UserContext);

  // Fetch all outfits from backend on mount
  useEffect(() => {
    async function fetchAllOutfits() {
      try {
        if (!user?.id && !user?._id) return;
        const userId = user.id || user._id;
        const [topsRes, bottomsRes, dressesRes] = await Promise.all([
          axios.get(`https://wardrobeai-backend.onrender.com/outfits?folder=top&userId=${userId}`),
          axios.get(`https://wardrobeai-backend.onrender.com/outfits?folder=bottom&userId=${userId}`),
          axios.get(`https://wardrobeai-backend.onrender.com/outfits?folder=dress&userId=${userId}`),
        ]);
        const tops = topsRes.data.urls.map(url => ({ url, category: 'top' }));
        const bottoms = bottomsRes.data.urls.map(url => ({ url, category: 'bottom' }));
        const dresses = dressesRes.data.urls.map(url => ({ url, category: 'dress' }));
        setClothes([...tops, ...bottoms, ...dresses]);
      } catch (err) {
        console.error('Failed to fetch outfits:', err);
      }
    }
    fetchAllOutfits();
  }, [user]);

  // Separate tops, bottoms, and dresses
  const tops = clothes.filter(item => item.category === 'top');
  const bottoms = clothes.filter(item => item.category === 'bottom');
  const dresses = clothes.filter(item => item.category === 'dress');

  // Allow selecting/unselecting 1 top, 1 bottom, or 1 dress (not both top+bottom and dress)
  const handleSelect = (item) => {
    if (item.category === 'dress') {
      if (selectedOutfit.some(i => i.category === 'dress' && i.url === item.url)) {
        setSelectedOutfit(selectedOutfit.filter(i => !(i.category === 'dress' && i.url === item.url)));
      } else {
        setSelectedOutfit([{ ...item }]); // Only one dress allowed, clear top/bottom
      }
    } else {
      // If a dress is already selected, clear it
      let filtered = selectedOutfit.filter(i => i.category !== 'dress');
      if (selectedOutfit.some(i => i.category === item.category && i.url === item.url)) {
        filtered = filtered.filter(i => !(i.category === item.category && i.url === item.url));
      } else {
        // Only one top and one bottom allowed
        filtered = [...filtered.filter(i => i.category !== item.category), { ...item }];
      }
      setSelectedOutfit(filtered);
    }
  };

  const isSelected = (item) => selectedOutfit.some(i => i.url === item.url && i.category === item.category);

  const handleImgClick = (imgUrl) => {
    setModalImg(imgUrl);
  };

  const closeModal = () => setModalImg(null);

  return (
    <div className="card">
      <h2>Select Outfit</h2>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8 }}>Tops</h3>
        <div className="grid-gallery">
          {tops.length === 0 && <p>No tops uploaded yet.</p>}
          {tops.map((item, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <img
                src={item.url}
                alt={`Top ${index}`}
                style={{
                  border: isSelected(item)
                    ? '3px solid #007bff'
                    : '2px solid #ddd',
                  cursor: 'pointer',
                  background: isSelected(item) ? '#eaf1ff' : 'transparent',
                }}
                onClick={() => handleSelect(item)}
                onDoubleClick={() => handleImgClick(item.url)}
              />
              {isSelected(item) && (
                <span style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: '#007bff',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
                }}>✓</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: 8 }}>Bottoms</h3>
        <div className="grid-gallery">
          {bottoms.length === 0 && <p>No bottoms uploaded yet.</p>}
          {bottoms.map((item, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <img
                src={item.url}
                alt={`Bottom ${index}`}
                style={{
                  border: isSelected(item)
                    ? '3px solid #007bff'
                    : '2px solid #ddd',
                  cursor: 'pointer',
                  background: isSelected(item) ? '#eaf1ff' : 'transparent',
                }}
                onClick={() => handleSelect(item)}
                onDoubleClick={() => handleImgClick(item.url)}
              />
              {isSelected(item) && (
                <span style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: '#007bff',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
                }}>✓</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 8 }}>Dresses</h3>
        <div className="grid-gallery">
          {dresses.length === 0 && <p>No dresses uploaded yet.</p>}
          {dresses.map((item, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <img
                src={item.url}
                alt={`Dress ${index}`}
                style={{
                  border: isSelected(item)
                    ? '3px solid #007bff'
                    : '2px solid #ddd',
                  cursor: 'pointer',
                  background: isSelected(item) ? '#eaf1ff' : 'transparent',
                }}
                onClick={() => handleSelect(item)}
                onDoubleClick={() => handleImgClick(item.url)}
              />
              {isSelected(item) && (
                <span style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: '#007bff',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
                }}>✓</span>
              )}
            </div>
          ))}
        </div>
      </div>
      {modalImg && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-img-container" onClick={e => e.stopPropagation()}>
            <img src={modalImg} alt="Preview" style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 12 }} />
            <button className="modal-close-btn" onClick={closeModal}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutfitSelector;
