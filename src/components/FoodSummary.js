import React, { useEffect, useState } from "react";
import './Food.css';

const FoodSummary = () => {
    const [totalConsumed, setTotalConsumed] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/food/summary/today`);
                const data = await res.json();
                setTotalConsumed(data.totalConsumed);
            } catch (err) {
                console.error("Error fetching food summary:", err);
            }
        };

        fetchSummary();
    }, []);

    return (
        <div className="food-summary">
            🍽️ Calories Consumed Today: {totalConsumed !== null ? `${totalConsumed} kcal` : 'Loading...'}
        </div>
    );
};

export default FoodSummary;
