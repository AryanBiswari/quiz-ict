// import React, { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase";
// import { useNavigate } from "react-router-dom";
// import "./Leaderboard.css";
// export default function Leaderboard() {
// const [leaderboard, setLeaderboard] = useState([]);
// const [userMap, setUserMap] = useState({});
// const navigate = useNavigate();

// useEffect(() => {
// const fetchLeaderboard = async () => {
// //       // Fetch all attempts
// const attemptsSnap = await getDocs(collection(db, "attempts"));
//       const attempts = attemptsSnap.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       // Fetch all quizzes for titles
//       const quizzesSnap = await getDocs(collection(db, "quizzes"));
//       const quizMap = {};
//       quizzesSnap.docs.forEach((doc) => (quizMap[doc.id] = doc.data().title));

//       // Fetch all users for names
//       const usersSnap = await getDocs(collection(db, "users"));
//       const _userMap = {};
//       usersSnap.docs.forEach(
//         (doc) =>
//           (_userMap[doc.id] = doc.data().name || doc.data().email || doc.id)
//       );
//       setUserMap(_userMap);

//       // Group by quiz, get top 5 for each
//       const leaderboardByQuiz = {};
//       attempts.forEach((a) => {
//         if (!leaderboardByQuiz[a.quizId]) leaderboardByQuiz[a.quizId] = [];
//         leaderboardByQuiz[a.quizId].push(a);
//       });
//       Object.keys(leaderboardByQuiz).forEach((quizId) => {
//         leaderboardByQuiz[quizId].sort((a, b) => b.score - a.score);
//         leaderboardByQuiz[quizId] = leaderboardByQuiz[quizId].slice(0, 5);
//       });
//       const flatLeaderboard = [];
//       Object.keys(leaderboardByQuiz).forEach((quizId) => {
//         leaderboardByQuiz[quizId].forEach((a, i) => {
//           flatLeaderboard.push({
//             quizTitle: quizMap[quizId] || "Unknown Quiz",
//             userId: a.userId,
//             score: a.score,
//             rank: i + 1,
//           });
//         });
//       });
//       setLeaderboard(flatLeaderboard);
//     };
//     fetchLeaderboard();
//   }, []);

// return (
// <div className="leaderboard-container">
//   <div className="leaderboard-header">
//     <h2>Leaderboard (Top 5 per Quiz)</h2>
//     <button onClick={() => navigate("/quiz-list")} className="back-btn">
//       Back to Quiz List
//     </button>
//   </div>

//   {leaderboard.length === 0 ? (
//     <p className="leaderboard-empty">No data yet.</p>
//   ) : (
//     <table className="leaderboard-table">
//       <thead>
//         <tr>
//           <th>Quiz</th>
//           <th>Student</th>
//           <th>Score (%)</th>
//           <th>Rank</th>
//         </tr>
//       </thead>
//       <tbody>
//         {leaderboard.map((row, i) => (
//           <tr key={i}>
//             <td>{row.quizTitle}</td>
//             <td>{userMap[row.userId] || row.userId.slice(0, 6) + "..."}</td>
//             <td className={row.score >= 90 ? "score-high" : ""}>
//               {row.score}
//             </td>
//             <td>#{row.rank}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   )}
// </div>
// );
// }
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userMap, setUserMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      // Fetch all attempts
      const attemptsSnap = await getDocs(collection(db, "attempts"));
      const attempts = attemptsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch all quizzes for titles
      const quizzesSnap = await getDocs(collection(db, "quizzes"));
      const quizMap = {};
      quizzesSnap.docs.forEach((doc) => (quizMap[doc.id] = doc.data().title));

      // Fetch all users for names
      const usersSnap = await getDocs(collection(db, "users"));
      const _userMap = {};
      usersSnap.docs.forEach(
        (doc) =>
          (_userMap[doc.id] = doc.data().name || doc.data().email || doc.id)
      );
      setUserMap(_userMap);

      // Group by quiz, get top 5 for each
      const leaderboardByQuiz = {};
      attempts.forEach((a) => {
        if (!leaderboardByQuiz[a.quizId]) leaderboardByQuiz[a.quizId] = [];
        leaderboardByQuiz[a.quizId].push(a);
      });
      Object.keys(leaderboardByQuiz).forEach((quizId) => {
        leaderboardByQuiz[quizId].sort((a, b) => b.score - a.score);
        leaderboardByQuiz[quizId] = leaderboardByQuiz[quizId].slice(0, 5);
      });
      const flatLeaderboard = [];
      Object.keys(leaderboardByQuiz).forEach((quizId) => {
        leaderboardByQuiz[quizId].forEach((a, i) => {
          flatLeaderboard.push({
            quizTitle: quizMap[quizId] || "Unknown Quiz",
            userId: a.userId,
            score: a.score,
            rank: i + 1,
          });
        });
      });
      setLeaderboard(flatLeaderboard);
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2>Leaderboard (Top 5 per Quiz)</h2>
        <button onClick={() => navigate("/quiz-list")} className="back-btn">
          Back to Quiz List
        </button>
      </div>

      {leaderboard.length === 0 ? (
        <p className="leaderboard-empty">No data yet.</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Quiz</th>
              <th>Student</th>
              <th>Score (%)</th>
              <th>Rank</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((row, i) => (
              <tr key={i}>
                <td data-label="Quiz">{row.quizTitle}</td>
                <td data-label="Student">
                  {userMap[row.userId] || row.userId.slice(0, 6) + "..."}
                </td>
                <td
                  data-label="Score (%)"
                  className={row.score >= 90 ? "score-high" : ""}
                >
                  {row.score}
                </td>
                <td data-label="Rank">#{row.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}