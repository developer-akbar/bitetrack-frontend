import React, { useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import './Food.css';

const FoodHistory = ({ entries, setEntries, showToast }) => {
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/food/history`)
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch((err) => console.error("Error fetching food history: ", err));
  }, [setEntries]);

  const handleDelete = async (id) => {
    if (!window.confirm("Do you want to delete this entry?")) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/food/delete/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setEntries(entries.filter((e) => e._id !== id));
        showToast("Entry deleted successfully!");
      } else {
        showToast("Failed to delete entry");
      }
    } catch (err) {
      console.error("Error deleting food entry: ", err);
      showToast("Error deleting entry");
    }
  };

  const handleUpdate = async (id, currentFoodText) => {
    const newText = window.prompt("Edit your food text:", currentFoodText);
    if (!newText || newText === currentFoodText) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/food/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ foodText: newText }),
      });

      if (res.ok) {
        const updated = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/food/history`);
        const data = await updated.json();
        setEntries(data);
        showToast("Entry updated successfully!");
      } else {
        showToast("Failed to update entry");
      }
    } catch (err) {
      console.error("Error updating food entry: ", err);
      showToast("Error updating entry");
    }
  };

  return (
    <div className="food-history">
      <h2 className="food-history-title">🍽️ Food History</h2>
      {entries.length === 0 ? (
        <p>No entries yet. Please start tracking every bite of yours.</p>
      ) : (
        <div className="food-history-list">
          {entries.map((entry) => (
            <div key={entry._id} className="item-entry">
              <div className="item-entry-top">
                <p className="food-text">{entry.foodText}</p>
                <div className="action-icons">
                  <FaEdit onClick={() => handleUpdate(entry._id, entry.foodText)} title="Edit" />
                  <FaTrash onClick={() => handleDelete(entry._id)} title="Delete" />
                </div>
              </div>
              <div className="food-macros">
                🥩 Protein: {entry.macros.protein}g | 🍚 Carbs: {entry.macros.carbs}g | 🧈 Fat: {entry.macros.fat}g | 🔥 Calories: {entry.macros.calories}
              </div>
              <div className="food-date">
                {new Date(entry.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodHistory;
