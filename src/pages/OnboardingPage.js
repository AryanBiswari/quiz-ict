import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import loginImage from "../assets/TS2.png";
import "./OnboardingPage.css";

export default function OnboardingPage() {
  const { user, setNeedsOnboarding } = useAuth();
  const [school, setSchool] = useState("");
  const [cls, setCls] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    await setDoc(
      doc(db, "users", user.uid),
      {
        name: user.displayName || "",
        email: user.email || "",
        class: cls,
        school,
      },
      { merge: true }
    );

    if (setNeedsOnboarding) setNeedsOnboarding(false);
    navigate("/quiz-list");
  };

  return (
    <div className="onboarding-wrapper">
      <div className="onboarding-card">
        {/* Left panel - Form */}
        <div className="onboarding-left">
          <h2 className="onboarding-heading">Tell us about yourself</h2>

          <form onSubmit={handleSubmit} className="onboarding-form">
            <label>
              <span>Select Class</span>
              <select
                value={cls}
                onChange={(e) => setCls(e.target.value)}
                required
                className="onboarding-input"
              >
                <option value="">Choose your class</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>School Name</span>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. ABC Public School"
                required
                className="onboarding-input"
              />
            </label>

            <button type="submit" className="onboarding-button">
              Continue
            </button>
          </form>
        </div>

        {/* Right panel - Image */}
        <div className="onboarding-right">
          <img
            src={loginImage}
            alt="Teacher and student"
            className="onboarding-image"
          />
        </div>
      </div>
    </div>
  );
}

