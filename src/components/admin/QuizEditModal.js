import React, { useState, useEffect } from "react";

export default function QuizEditModal({ quiz, onCancel, onSave }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    setForm(quiz);
  }, [quiz]);

  if (!form) return null;

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (qIdx, field, value) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === qIdx ? { ...q, [field]: value } : q
      ),
    }));
  };

  const handleOptionChange = (qIdx, oIdx, value) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((opt, j) => j === oIdx ? value : opt) }
          : q
      ),
    }));
  };

  const addNewQuestion = () => {
    setForm(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: "", options: ["", "", "", ""], answer: "" }
      ]
    }));
  };

  return (
    <div style={{
      position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
    }}>
      <div style={{
        background: "#fff", padding: 30, borderRadius: 10, minWidth: 360, maxWidth: "90vw", maxHeight: "90vh", overflow: "auto"
      }}>
        <h3>Edit Quiz</h3>
        <input
          value={form.title}
          onChange={e => handleChange("title", e.target.value)}
          placeholder="Title"
          style={{ display: "block", marginBottom: 10, width: "100%", padding: "8px" }}
        />
        <input
          value={form.class}
          onChange={e => handleChange("class", e.target.value)}
          placeholder="Class"
          style={{ display: "block", marginBottom: 10, width: "100%", padding: "8px" }}
        />
        <div>
          {form.questions.map((q, qIdx) => (
            <div key={qIdx} style={{ border: "1px solid #eee", borderRadius: 8, padding: 10, marginBottom: 10 }}>
              <input
                value={q.question}
                onChange={e => handleQuestionChange(qIdx, "question", e.target.value)}
                placeholder={`Question ${qIdx + 1}`}
                style={{ width: "100%", marginBottom: 5, padding: "5px" }}
              />
              {q.options.map((opt, oIdx) => (
                <input
                  key={oIdx}
                  value={opt}
                  onChange={e => handleOptionChange(qIdx, oIdx, e.target.value)}
                  placeholder={`Option ${oIdx + 1}`}
                  style={{ width: "48%", marginRight: "2%", marginBottom: 4, padding: "5px" }}
                />
              ))}
              <input
                value={q.answer}
                onChange={e => handleQuestionChange(qIdx, "answer", e.target.value)}
                placeholder="Correct Answer"
                style={{ width: "100%", padding: "5px" }}
              />
            </div>
          ))}
          <button onClick={addNewQuestion} style={{
            background: "#ddd", padding: "6px 16px", borderRadius: 6, border: "none", cursor: "pointer", marginTop: 8
          }}>+ Add Question</button>
        </div>
        <div style={{ marginTop: 20, textAlign: "right" }}>
          <button onClick={onCancel} style={{ marginRight: 12 }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{
            background: "#2563eb", color: "#fff", padding: "8px 18px", borderRadius: 6, border: "none"
          }}>Save</button>
        </div>
      </div>
    </div>
  );
}
