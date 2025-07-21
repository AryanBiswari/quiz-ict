// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { doc, setDoc } from "firebase/firestore";
// import { db } from "../firebase";
// import loginImage from "../assets/ChatGPT Image Jul 9, 2025, 05_59_35 PM.png";

// export default function OnboardingPage() {
//   // --- 👇 ADD setNeedsOnboarding here!
//   const { user, setNeedsOnboarding } = useAuth();
//   const [school, setSchool] = useState("");
//   const [cls, setCls] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!user) return;

//     await setDoc(
//       doc(db, "users", user.uid),
//       {
//         name: user.displayName || "",
//         email: user.email || "",
//         class: cls,
//         school,
//       },
//       { merge: true }
//     );
//     // --- 👇 Fix: Instantly update onboarding state and redirect
//     if (setNeedsOnboarding) setNeedsOnboarding(false);
//     navigate("/quiz-list");
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
//       {/* Left Panel - Form */}
//       <div
//         style={{
//           flex: 1,
//           backgroundColor: "#ffffff",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           padding: "2rem",
//           boxShadow: "4px 0 15px rgba(0, 0, 0, 0.05)",
//         }}
//       >
//         <h2 style={{ fontSize: "1.8rem", marginBottom: "2rem", color: "#333", fontWeight: "600" }}>
//           Tell us about yourself
//         </h2>

//         <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "400px" }}>
//           <label style={{ display: "block", marginBottom: "1rem" }}>
//             <span style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
//               Select Class
//             </span>
//             <select
//               value={cls}
//               onChange={(e) => setCls(e.target.value)}
//               required
//               style={{
//                 width: "100%",
//                 padding: "0.75rem",
//                 borderRadius: "8px",
//                 border: "1px solid #ccc",
//               }}
//             >
//               <option value="">Choose your class</option>
//               {[...Array(12)].map((_, i) => (
//                 <option key={i + 1} value={i + 1}>
//                   {i + 1}
//                 </option>
//               ))}
//             </select>
//           </label>

//           <label style={{ display: "block", marginBottom: "1.5rem" }}>
//             <span style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
//               School Name
//             </span>
//             <input
//               type="text"
//               value={school}
//               onChange={(e) => setSchool(e.target.value)}
//               placeholder="e.g., ABC Public School"
//               required
//               style={{
//                 width: "100%",
//                 padding: "0.75rem",
//                 borderRadius: "8px",
//                 border: "1px solid #ccc",
//               }}
//             />
//           </label>

//           <button
//             type="submit"
//             style={{
//               width: "100%",
//               padding: "0.9rem",
//               borderRadius: "8px",
//               border: "none",
//               backgroundColor: "#4f46e5",
//               color: "#fff",
//               fontSize: "1rem",
//               fontWeight: "600",
//               cursor: "pointer",
//               transition: "background-color 0.2s ease",
//             }}
//             onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4338ca")}
//             onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
//           >
//             Continue
//           </button>
//         </form>
//       </div>

//       {/* Right Panel - Image */}
//       <div
//         style={{
//           flex: 1,
//           backgroundColor: "#f4f6fc",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <img
//           src={loginImage}
//           alt="Teacher and student"
//           style={{
//             width:"41rem",
//             maxWidth: "100%",
//             maxHeight:"100%",
//             filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))",
//           }}
//         />
//       </div>
//     </div>
//   );
// }

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

