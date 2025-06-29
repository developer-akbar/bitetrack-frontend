import React, { useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import './Burn.css';

const BurnHistory = ({ entries, setEntries, showToast }) => {
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/burn/history`)
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch((err) => console.error("Error fetching burn history: ", err));
  }, [setEntries]);

  const handleDelete = async (id) => {
    if (!window.confirm("Do you want to delete this entry?")) return;

    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/burn/delete/${id}`, {
        method: "DELETE",
      });
      setEntries((prev) => prev.filter((e) => e._id !== id));
      showToast("Burn entry deleted");
    } catch (err) {
      console.error("Error deleting burn entry: ", err);
    }
  };

  const handleUpdate = async (id, currentText) => {
    const newText = window.prompt("Edit your activity:", currentText);
    if (!newText || newText === currentText) return;

    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/burn/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activityText: newText }),
      });

      const updated = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/burn/history`).then((res) =>
        res.json()
      );
      setEntries(updated);
      showToast("Burn entry updated");
    } catch (err) {
      console.error("Error updating burn entry: ", err);
    }
  };

  return (
    <div className="burn-history">
      <h2 className="burn-history-title">🔥 Burn History</h2>
      {entries.length === 0 ? (
        <p>No burn entries yet.</p>
      ) : (
        <div className="burn-history-list">
          {entries.map((entry) => (
            <div key={entry._id} className="item-entry">
              <div className="item-entry-top">
                <p className="burn-text">{entry.activityText}</p>
                <div className="action-icons">
                  <FaEdit onClick={() => handleUpdate(entry._id, entry.activityText)} title="Edit" />
                  <FaTrash onClick={() => handleDelete(entry._id)} title="Delete" />
                </div>
              </div>
              <div className="burn-calories">
                🔥 {entry.burn.calories} kcal
              </div>
              <div className="burn-date">
                {new Date(entry.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BurnHistory;
