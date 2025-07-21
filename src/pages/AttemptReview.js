import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./AttemptReview.css";

export default function AttemptReview() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [attempt, setAttempt] = useState(null);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    if (!user) return; // wait for user to be loaded

    const fetchData = async () => {
      const snap = await getDoc(doc(db, "attempts", attemptId));
      if (!snap.exists()) return;

      const attemptData = snap.data();
      if (attemptData.userId !== user.uid) {
        alert("You are not authorized to view this attempt.");
        navigate("/quiz-list");
        return;
      }

      setAttempt({ id: attemptId, ...attemptData });

      const quizSnap = await getDoc(doc(db, "quizzes", attemptData.quizId));
      if (quizSnap.exists()) {
        setQuiz(quizSnap.data());
      }
    };

    fetchData();
  }, [attemptId, user, navigate]);

  if (!user) {
    return (
      <p className="review-loading">
        Loading user info…
      </p>
    );
  }

  if (!attempt || !quiz) {
    return (
      <p className="review-loading">
        Loading review…
      </p>
    );
  }

  return (
    <div className="review-container">
      <h2 className="review-title">Quiz Review: {quiz.title}</h2>
      <p>
        Score:{" "}
        <strong
          className={
            attempt.score >= 90 ? "score-high" : "score-normal"
          }
        >
          {attempt.score}%
        </strong>
      </p>
      <ol>
        {quiz.questions.map((q, i) => {
          const studentAns = attempt.answers[i];
          const isCorrect = studentAns === q.answer;
          return (
            <li
              key={i}
              className={`review-question ${
                isCorrect ? "correct" : "incorrect"
              }`}
            >
              <div className="question-text">{q.question}</div>
              <div>
                <strong>Your answer:</strong>{" "}
                <span className={isCorrect ? "answer-correct" : "answer-incorrect"}>
                  {studentAns || "Not Answered"}
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
                    className={`option ${
                      opt === studentAns ? "selected-option" : ""
                    }`}
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
      <button
        onClick={() => navigate("/quiz-list")}
        className="back-btn"
      >
        Back to Quiz List
      </button>
    </div>
  );
}
