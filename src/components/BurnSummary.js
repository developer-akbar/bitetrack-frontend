import React, { useEffect, useState } from "react";
import './Burn.css';
import { FaFire } from "react-icons/fa";

const BurnSummary = () => {
    const [totalBurned, setTotalBurned] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/burn/summary/today`);
                const data = await res.json();
                setTotalBurned(data.totalBurned);
            } catch (err) {
                console.error("Error fetching burn summary:", err);
            }
        };

        fetchSummary();
    }, []);

    return (
        <div className="burn-summary-box">
            <FaFire className="burn-summary-icon" />
            Calories Burned Today:{" "}
            {totalBurned !== null ? `${totalBurned} kcal` : "Loading..."}
        </div>
    );
};

export default BurnSummary;
