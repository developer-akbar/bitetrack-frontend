import React, { useState, useEffect } from "react";
import FoodForm from './components/FoodForm';
import FoodHistory from './components/FoodHistory';
import Toast from './components/Toast';
import BurnTracker from './BurnTracker';
import FoodSummary from "./components/FoodSummary";
import Settings from "./components/Settings";
import { getProfileFromCookie, saveProfileToCookie } from './utils/cookieUtils';
import DashboardSummary from "./components/DashboardSummary";
import './styles/App.css';
import './theme.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const [foodText, setFoodText] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [entries, setEntries] = useState([]);
  const [userName, setUserName] = useState('');

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const cookieProfile = getProfileFromCookie();
    if (cookieProfile && cookieProfile.name) {
      setUserName(cookieProfile.name);
    } else {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/profile/latest-profile`)
        .then(res => res.json())
        .then(profile => {
          if (!profile.name) return;
          
          setUserName(profile.name);
          saveProfileToCookie(profile);
        })
        .catch(err => console.error('Error fetching profile: ', err));
    }
  }, []);

  const showToastMessage = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }

  const fetchFoodEntries = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/food/history`);
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error("Error fetching food history: ", err);
    }
  };

  useEffect(() => {
    fetchFoodEntries();
  }, []);

  const analyzeFood = async () => {
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/food/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ foodText })
      });

      const data = await res.json();
      setResponse(data);
      if (!data.error) {
        showToastMessage("Entry saved successfully!");
        setFoodText("");
        fetchFoodEntries();
      }
    } catch (err) {
      console.error("Error: ", err);
      setResponse({ error: "Something went wrong while analyzing your food, please try again" });
    }

    setLoading(false);
  }

  return (
    <div>
      <div className="tab-nav">
        <div onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>Dashboard</div>
        <div onClick={() => setActiveTab('food')} className={activeTab === 'food' ? 'active' : ''}>Food</div>
        <div onClick={() => setActiveTab('burn')} className={activeTab === 'burn' ? 'active' : ''}>Burn</div>
        <div onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? 'active' : ''}>Settings</div>
      </div>

      {showToast && <Toast message={toastMessage} />}

      {activeTab === 'dashboard' && (
        <>
          <h1>BiteTrack 🍴</h1>
          <p>Your personal nutrition & fitness tracker powered by AI</p>

          <span style={{ fontSize: '16px', marginLeft: '10px', color: 'var(--text-color)' }}>
            {userName ? `Welcome, ${userName}!` : ''}
          </span>

          <DashboardSummary />
        </>
      )}

      {activeTab === 'food' && (
        <>
          <FoodSummary />

          <FoodForm
            foodText={foodText}
            setFoodText={setFoodText}
            loading={loading}
            analyzeFood={analyzeFood}
            response={response}
          />

          <FoodHistory
            entries={entries}
            setEntries={setEntries}
            showToast={showToastMessage}
          />
        </>
      )}

      {activeTab === 'burn' &&
        <BurnTracker showToast={showToastMessage} />
      }

      {activeTab === 'settings' && (
        <Settings
          toggleTheme={toggleTheme}
          currentTheme={theme}
          showToast={showToastMessage}
        />
      )}

    </div>
  );
}

export default App;