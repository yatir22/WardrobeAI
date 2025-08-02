import React from 'react';
import './Tabs.css';

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'photo', label: 'Upload Your Photo' },
    { id: 'clothes', label: 'Upload Clothes' },
    { id: 'outfit', label: 'Select Outfit' },
    { id: 'preview', label: 'Preview' }
  ];

  return (
    <div className="tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={activeTab === tab.id ? 'active' : ''}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
