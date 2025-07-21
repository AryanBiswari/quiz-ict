import React from "react";

export default function QuizCreateForm({
  quizTitle, setQuizTitle, quizClass, setQuizClass,
  questions, setQuestions, handleCreateQuiz
}) {
  const handleQuestionChange = (qIdx, field, value) => {
    setQuestions(prev => prev.map((q, i) =>
      i === qIdx ? { ...q, [field]: value } : q
    ));
  };
  const handleOptionChange = (qIdx, oIdx, value) => {
    setQuestions(prev => prev.map((q, i) =>
      i === qIdx
        ? { ...q, options: q.options.map((opt, j) => j === oIdx ? value : opt) }
        : q
    ));
  };
  const addNewQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: "" }]);
  };

  return (
    <form onSubmit={handleCreateQuiz} style={{ marginBottom: 32, background: "#f9f9f9", padding: "1.5rem", borderRadius: 8 }}>
      <input
        type="text"
        placeholder="Quiz Title"
        value={quizTitle}
        onChange={e => setQuizTitle(e.target.value)}
        style={{ marginBottom: 10, width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
        required
      />
      <input
        type="text"
        placeholder="Class (e.g., 12th)"
        value={quizClass}
        onChange={e => setQuizClass(e.target.value)}
        style={{ marginBottom: 14, width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
        required
      />
      {questions.map((q, qIdx) => (
        <div key={qIdx} style={{ border: "1px solid #eee", borderRadius: 8, padding: 10, marginBottom: 10 }}>
          <input
            value={q.question}
            onChange={e => handleQuestionChange(qIdx, "question", e.target.value)}
            placeholder={`Question ${qIdx + 1}`}
            style={{ width: "100%", marginBottom: 5, padding: "5px" }}
            required
          />
          {q.options.map((opt, oIdx) => (
            <input
              key={oIdx}
              value={opt}
              onChange={e => handleOptionChange(qIdx, oIdx, e.target.value)}
              placeholder={`Option ${oIdx + 1}`}
              style={{ width: "48%", marginRight: "2%", marginBottom: 4, padding: "5px" }}
              required
            />
          ))}
          <input
            value={q.answer}
            onChange={e => handleQuestionChange(qIdx, "answer", e.target.value)}
            placeholder="Correct Answer"
            style={{ width: "100%", padding: "5px" }}
            required
          />
        </div>
      ))}
      <button type="button" onClick={addNewQuestion} style={{
        background: "#ddd", padding: "8px 18px", borderRadius: 6, border: "none", cursor: "pointer", marginBottom: 10
      }}>+ Add Question</button>
      <br />
      <button type="submit" style={{
        padding: "10px 30px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold"
      }}>Upload Quiz</button>
    </form>
  );
}
