import React from "react";

export default function QuizToast({ message, onClose }) {
  if (!message) return null;
  return (
    <div style={{
      position: "fixed", bottom: 30, right: 30,
      background: "#111", color: "#fff", padding: "1rem 2rem", borderRadius: 8,
      zIndex: 10000, minWidth: 160
    }}>
      {message}
      <button style={{
        background: "transparent", border: "none", color: "#fff", marginLeft: 12, cursor: "pointer", fontWeight: "bold"
      }} onClick={onClose}>✕</button>
    </div>
  );
}
