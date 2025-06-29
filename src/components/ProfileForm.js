import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';

const ProfileForm = ({ profile, showToast, onSave }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
        gender: "male",
        height: "",
        weight: "",
        activityLevel: "moderate",
    });

    useEffect(() => {
        if (profile) {
            setFormData(profile);
        }
    }, [profile]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = profile?._id
                ? `${process.env.REACT_APP_BACKEND_URL}/api/profile/update/${profile._id}`
                : `${process.env.REACT_APP_BACKEND_URL}/api/profile/create`;

            const method = profile?._id ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            Cookies.set("userProfile", JSON.stringify(data), { expires: 7 });
            showToast?.("Profile saved successfully!");
            onSave?.(data);
        } catch (err) {
            console.error("Error saving profile:", err);
            showToast?.("Failed to save profile.");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
            <h2>👤 User Profile</h2>

            <label>Name: <input type="text" name="name" value={formData.name} onChange={handleChange} required /></label><br />
            <label>Email: <input type="email" name="email" value={formData.email} onChange={handleChange} required /></label><br />
            <label>Age: <input type="number" name="age" value={formData.age} onChange={handleChange} required /></label><br />
            <label>Gender:
                <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </label><br />
            <label>Height (cm): <input type="number" name="height" value={formData.height} onChange={handleChange} required /></label><br />
            <label>Weight (kg): <input type="number" name="weight" value={formData.weight} onChange={handleChange} required /></label><br />
            <label>Activity Level:
                <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                    <option value="very_active">Very Active</option>
                </select>
            </label><br />
            <button className="btn" type="submit">Save Profile</button>
        </form>
    );
};

export default ProfileForm;
