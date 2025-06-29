import React from "react";
import './Food.css';

const FoodForm = ({ foodText, setFoodText, loading, analyzeFood, response }) => (
  <>
    <input
      className="food-input"
      type="text"
      placeholder="Enter food description (e.g., 2 rotis and cup of dal)"
      value={foodText}
      onChange={(e) => setFoodText(e.target.value)}
    />
    <button
      className="food-button"
      onClick={analyzeFood}
      disabled={loading}
    >
      {loading ? "Analyzing..." : "Analyze"}
    </button>

    {response && (
      <div className="food-response" style={{ marginTop: "2rem" }}>
        {response.error ? (
          <p style={{ color: "var(--text-color)" }}>{response.error}</p>
        ) : (
          <div>
            <h3>Nutrition Breakdown:</h3>
            <ul>
              {Object.entries(response).map(([key, value]) => (
                <li key={key}>
                  <strong>{key.toUpperCase()}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )}
  </>
);

export default FoodForm;