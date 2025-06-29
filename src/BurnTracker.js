// src/BurnTracker.js
import React, { useState } from 'react';
import BurnForm from './components/BurnForm';
import BurnHistory from './components/BurnHistory';
import BurnSummary from "./components/BurnSummary";

const BurnTracker = ({ showToast }) => {
    const [burnEntries, setBurnEntries] = useState([]);

    const fetchBurnEntries = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/burn/history`);
            const data = await res.json();
            setBurnEntries(data);
        } catch (err) {
            console.error("Error fetching burn history:", err);
        }
    };

    return (
        <div>
            <BurnSummary />

            <BurnForm onEntrySaved={fetchBurnEntries} showToast={showToast} />

            <BurnHistory
                entries={burnEntries}
                setEntries={setBurnEntries}
                showToast={showToast}
            />
        </div>
    );
};

export default BurnTracker;
