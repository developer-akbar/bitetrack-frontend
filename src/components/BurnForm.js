import React, { useState } from 'react';
import './Burn.css';

const BurnForm = ({ onEntrySaved, showToast }) => {
  const [activityText, setActivityText] = useState('');
  const [loading, setLoading] = useState(false);

  const analyzeActivity = async () => {
    if (!activityText.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/burn/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityText }),
      });
      const data = await res.json();
      if (!data.error) {
        showToast('Burn entry saved!');
        setActivityText('');
        onEntrySaved();
      } else {
        showToast(data.error);
      }
    } catch (err) {
      console.error('Error analyzing activity:', err);
      showToast('Failed to save burn entry');
    }
    setLoading(false);
  };

  return (
    <div className="burn-form">
      <input
        type="text"
        placeholder="Enter activity (e.g., 30 min brisk walk)"
        value={activityText}
        onChange={(e) => setActivityText(e.target.value)}
        className="burn-input"
      />
      <button
        onClick={analyzeActivity}
        className="btn"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Burn Entry'}
      </button>
    </div>
  );
};

export default BurnForm;
