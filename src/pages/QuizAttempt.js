import React, { useEffect, useState, useCallback } from "react";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./QuizAttempt.css";

// --- Confetti celebration component ---
function ConfettiCelebration() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 10000,
      }}
    >
      {[...Array(70)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: Math.random() * 100 + "vw",
            top: Math.random() * 100 + "vh",
            width: 10,
            height: 16,
            background: ["#fbbf24", "#34d399", "#60a5fa", "#f87171", "#a78bfa"][i % 5],
            opacity: 0.7,
            borderRadius: 4,
            animation: `fall${i % 5} 1.4s linear`,
          }}
        />
      ))}
      <style>
        {`
        @keyframes fall0 { to { transform: translateY(100vh) rotate(25deg); } }
        @keyframes fall1 { to { transform: translateY(110vh) rotate(-30deg); } }
        @keyframes fall2 { to { transform: translateY(105vh) rotate(40deg); } }
        @keyframes fall3 { to { transform: translateY(115vh) rotate(-15deg); } }
        @keyframes fall4 { to { transform: translateY(120vh) rotate(10deg); } }
        `}
      </style>
    </div>
  );
}

export default function QuizAttempt() {
  const { id } = useParams(); // quiz id from URL
  const { user } = useAuth();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch quiz details
  useEffect(() => {
    const fetchQuiz = async () => {
      const snap = await getDoc(doc(db, "quizzes", id));
      if (snap.exists()) {
        setQuiz({ id: snap.id, ...snap.data() });
        setAnswers(Array(snap.data().questions.length).fill(""));
        setSecondsLeft(snap.data().questions.length * 60); // 1 min per question
      }
    };
    fetchQuiz();
  }, [id]);

  // Save attempt
  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();
      if (submitted || saving) return;

      setSaving(true);
      let correct = 0;
      quiz.questions.forEach((q, idx) => {
        if (answers[idx] === q.answer) correct++;
      });
      const percent = Math.round((correct / quiz.questions.length) * 100);

      try {
        await addDoc(collection(db, "attempts"), {
          userId: user.uid,
          quizId: quiz.id,
          score: percent,
          answers,
          timestamp: Date.now(),
        });
        setScore(percent);
        setSubmitted(true);
        if (percent >= 90) setShowConfetti(true);
      } catch (err) {
        alert("Error saving attempt! Please try again.");
      }
      setSaving(false);
    },
    [submitted, saving, quiz, answers, user]
  );

  // Timer logic
  useEffect(() => {
    if (!quiz || submitted || secondsLeft === null) return;
    if (secondsLeft === 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((sec) => (sec > 0 ? sec - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [quiz, submitted, secondsLeft, handleSubmit]);

  if (!quiz) return <p style={{ textAlign: "center", marginTop: 60 }}>Loading quiz...</p>;

  const handleOptionChange = (qIdx, option) => {
    setAnswers((prev) => prev.map((ans, idx) => (idx === qIdx ? option : ans)));
  };

  if (submitted) {
    return (
      <div className="review-container">
        {showConfetti && <ConfettiCelebration />}
        <h2 className="review-title">
          {score >= 90 ? "🎉 Congratulations!" : "Quiz Completed"}
        </h2>
        <p>
          Your Score:{" "}
          <strong className={score >= 90 ? "score-high" : "score-normal"}>
            {score}%
          </strong>
        </p>
        <ol>
          {quiz.questions.map((q, i) => {
            const isCorrect = answers[i] === q.answer;
            return (
              <li
                key={i}
                className={`review-question ${isCorrect ? "correct" : "incorrect"}`}
              >
                <div className="question-text">{q.question}</div>
                <div>
                  <strong>Your answer:</strong>{" "}
                  <span className={isCorrect ? "answer-correct" : "answer-incorrect"}>
                    {answers[i] || "Not Answered"}
                  </span>
                </div>
                {!isCorrect && (
                  <div>
                    <strong>Correct answer:</strong>{" "}
                    <span className="answer-correct">{q.answer}</span>
                  </div>
                )}
                <div>
                  <em>Options:</em>{" "}
                  {q.options.map((opt, idx) => (
                    <span
                      key={idx}
                      className={`option ${opt === answers[i] ? "selected-option" : ""}`}
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
        <button onClick={() => navigate("/quiz-list")} className="back-btn">
          Back to Quiz List
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">{quiz.title}</h2>
      <p className="quiz-class">Class: {quiz.class}</p>
      <div className="time-left">
        Time left: {Math.floor((secondsLeft ?? 0) / 60)}:
        {("0" + ((secondsLeft ?? 0) % 60)).slice(-2)}
      </div>
      <form onSubmit={handleSubmit}>
        <ol>
          {quiz.questions.map((q, i) => (
            <li key={i} className="question-block">
              <div className="question-text">{q.question}</div>
              <div>
                {q.options.map((option, idx) => (
                  <label key={idx} className="option-label">
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={option}
                      checked={answers[i] === option}
                      onChange={() => handleOptionChange(i, option)}
                      disabled={submitted}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </li>
          ))}
        </ol>
        <button type="submit" disabled={saving} className="submit-btn">
          Submit Quiz
        </button>
      </form>
    </div>
  );
}
