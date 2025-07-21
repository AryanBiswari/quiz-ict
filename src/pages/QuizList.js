import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./QuizList.css";

export default function QuizList() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const fetchClassAndQuizzes = async () => {
      const usersSnap = await getDocs(
        query(collection(db, "users"), where("email", "==", user.email))
      );
      if (usersSnap.empty) {
        setLoading(false);
        return;
      }
      const studentData = usersSnap.docs[0].data();
      const studentClass = studentData.class;

      const quizSnap = await getDocs(
        query(collection(db, "quizzes"), where("class", "==", studentClass))
      );
      const quizList = quizSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuizzes(quizList);

      const attemptSnap = await getDocs(
        query(collection(db, "attempts"), where("userId", "==", user.uid))
      );
      const attemptsList = attemptSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAttempts(attemptsList);
      setLoading(false);
    };
    fetchClassAndQuizzes();
  }, [user]);

  const attemptedQuizIds = new Set(attempts.map((a) => a.quizId));
  const notAttemptedQuizzes = quizzes.filter((q) => !attemptedQuizIds.has(q.id));
  const attemptedQuizzes = quizzes.filter((q) => attemptedQuizIds.has(q.id));

  const getAttempt = (quizId) => attempts.find((a) => a.quizId === quizId);

  if (loading)
    return <p className="loading-text">Loading...</p>;

  return (
    <div className="quizlist-container">
      {/* Header */}
      <div className="quizlist-header">
        <h2>Available Quizzes</h2>
        <div>
          <button
            onClick={() => navigate("/leaderboard")}
            className="quizlist-btn"
          >
            View Leaderboard
          </button>
          <button
            onClick={logout}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Not Attempted Quizzes */}
      <div>
        {notAttemptedQuizzes.length === 0 ? (
          <div className="no-quizzes">
            No more quizzes left to attempt for your class!
          </div>
        ) : (
          <table className="quiz-table">
            <thead>
              <tr>
                <th>Quiz Title</th>
                <th>Total Questions</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {notAttemptedQuizzes.map((q) => (
                <tr key={q.id}>
                  <td>{q.title}</td>
                  <td>{q.questions.length}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/quiz/${q.id}`)}
                      className="start-quiz-btn"
                    >
                      Start Quiz
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Attempted Quizzes */}
      <h2 className="attempted-title">Attempted Quizzes</h2>
      {attemptedQuizzes.length === 0 ? (
        <p className="no-attempted">No attempted quizzes yet.</p>
      ) : (
        <div className="attempted-container">
          <table className="attempted-table">
            <thead>
              <tr>
                <th>Quiz Title</th>
                <th>Score (%)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attemptedQuizzes.map((q) => {
                const attempt = getAttempt(q.id);
                return (
                  <tr key={q.id}>
                    <td>{q.title}</td>
                    <td>
                      {attempt?.score ?? "--"}
                      <br />
                      <span style={{ fontSize: 13, color: "#888" }}>
                        {attempt
                          ? new Date(attempt.timestamp).toLocaleString()
                          : "--"}
                      </span>
                    </td>
                    <td>
                      {attempt && (
                        <button
                          onClick={() => navigate(`/attempt/${attempt.id}`)}
                          className="view-details-btn"
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

