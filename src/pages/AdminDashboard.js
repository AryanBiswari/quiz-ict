// import React, { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase";
// import { useAuth } from "../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function AdminDashboard() {
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const [students, setStudents] = useState([]);
//   const [quizzes, setQuizzes] = useState([]);
//   const [attempts, setAttempts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Filter/search state
//   const [search, setSearch] = useState("");
//   const [filterClass, setFilterClass] = useState("");
//   const [filterQuiz, setFilterQuiz] = useState("");
//   const [minScore, setMinScore] = useState("");
//   const [maxScore, setMaxScore] = useState("");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");

//   // Force re-render on resize to fix DevTools responsiveness
//   const [, setWindowWidth] = useState(window.innerWidth);
//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       const studentSnap = await getDocs(collection(db, "users"));
//       const quizSnap = await getDocs(collection(db, "quizzes"));
//       const attemptSnap = await getDocs(collection(db, "attempts"));
//       setStudents(studentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//       setQuizzes(quizSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//       setAttempts(attemptSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//       setLoading(false);
//     };
//     fetchData();
//   }, []);

//   const highScorers = attempts.filter(a => Number(a.score) >= 90);

//   // Lookup helpers
//   const getStudent = (userId) => students.find(u => u.id === userId) || {};
//   const getQuiz = (quizId) => quizzes.find(q => q.id === quizId) || {};

//   // Filter logic
//   const filteredAttempts = attempts.filter((a) => {
//     const stu = getStudent(a.userId);
//     const quiz = getQuiz(a.quizId);

//     // Search match (name, email, quiz title, quiz class, student class)
//     const searchStr = (search || "").toLowerCase();
//     const matchesSearch =
//       !searchStr ||
//       (stu.name && stu.name.toLowerCase().includes(searchStr)) ||
//       (stu.email && stu.email.toLowerCase().includes(searchStr)) ||
//       (quiz.title && quiz.title.toLowerCase().includes(searchStr)) ||
//       (quiz.class && quiz.class.toString().includes(searchStr)) ||
//       (stu.class && stu.class.toString().includes(searchStr));

//     // Class filter (student class)
//     const matchesClass = !filterClass || stu.class === filterClass;

//     // Quiz filter
//     const matchesQuiz = !filterQuiz || quiz.id === filterQuiz;

//     // Score range filter
//     const numScore = Number(a.score);
//     const matchesScore =
//       (!minScore || numScore >= Number(minScore)) &&
//       (!maxScore || numScore <= Number(maxScore));

//     // Date range filter
//     const attemptDate = a.timestamp ? new Date(a.timestamp) : null;
//     const fromDate = dateFrom ? new Date(dateFrom) : null;
//     const toDate = dateTo ? new Date(dateTo) : null;
//     const matchesFrom = !fromDate || (attemptDate && attemptDate >= fromDate);
//     const matchesTo = !toDate || (attemptDate && attemptDate <= toDate);

//     return matchesSearch && matchesClass && matchesQuiz && matchesScore && matchesFrom && matchesTo;
//   });

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h2 style={styles.heading}>Welcome, Admin 👋</h2>
//         <div>
//           <button onClick={() => navigate("/upload-quiz")} style={styles.uploadBtn}>
//             ➕ Upload Quiz
//           </button>
//           <button onClick={logout} style={styles.logoutBtn}>
//             Logout
//           </button>
//         </div>
//       </div>

//       <div style={styles.cardGrid}>
//         <DashboardCard title="Total Students" value={students.length} />
//         <DashboardCard title="Total Quizzes" value={quizzes.length} />
//         <DashboardCard title="Total Attempts" value={attempts.length} />
//         <DashboardCard title="90%+ Scorers" value={highScorers.length} />
//       </div>

//       {/* FILTER BAR */}
//       <div style={{
//         margin: "2.5rem 0 1.2rem 0",
//         display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center",
//         background: "#fff", padding: "10px 12px", borderRadius: "8px"
//       }}>
//         <input
//           placeholder="🔍 Search name, email, quiz, class..."
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           style={filterInput}
//         />
//         <select
//           value={filterClass}
//           onChange={e => setFilterClass(e.target.value)}
//           style={filterInput}
//         >
//           <option value="">All Classes</option>
//           {[...new Set(students.map(stu => stu.class).filter(Boolean))].map(cls =>
//             <option key={cls} value={cls}>{cls}</option>
//           )}
//         </select>
//         <select
//           value={filterQuiz}
//           onChange={e => setFilterQuiz(e.target.value)}
//           style={filterInput}
//         >
//           <option value="">All Quizzes</option>
//           {quizzes.map(q =>
//             <option key={q.id} value={q.id}>{q.title}</option>
//           )}
//         </select>
//         <input
//           type="number"
//           placeholder="Min Score"
//           value={minScore}
//           onChange={e => setMinScore(e.target.value)}
//           style={filterInput}
//           min={0}
//           max={100}
//         />
//         <span>-</span>
//         <input
//           type="number"
//           placeholder="Max Score"
//           value={maxScore}
//           onChange={e => setMaxScore(e.target.value)}
//           style={filterInput}
//           min={0}
//           max={100}
//         />
//         <input
//           type="date"
//           value={dateFrom}
//           onChange={e => setDateFrom(e.target.value)}
//           style={filterInput}
//         />
//         <span>to</span>
//         <input
//           type="date"
//           value={dateTo}
//           onChange={e => setDateTo(e.target.value)}
//           style={filterInput}
//         />
//         <button
//           onClick={() => {
//             setSearch("");
//             setFilterClass("");
//             setFilterQuiz("");
//             setMinScore("");
//             setMaxScore("");
//             setDateFrom("");
//             setDateTo("");
//           }}
//           style={{
//             ...filterInput,
//             background: "#e5e7eb", color: "#222", fontWeight: "bold", cursor: "pointer"
//           }}
//         >
//           Reset
//         </button>
//       </div>

//       <h3 style={{marginTop:0,marginBottom:"1rem",fontWeight:"600",color:"#2563eb"}}>All Quiz Attempts</h3>
//       {loading ? (
//         <p>Loading data...</p>
//       ) : filteredAttempts.length === 0 ? (
//         <p>No matching attempts found.</p>
//       ) : (
//         <div
//           style={{
//             overflowX: "auto",
//             width: "100%",
//             background: "#fff",
//             borderRadius: "12px",
//             boxShadow: "0 2px 12px #0001"
//           }}
//         >
//           <table style={{
//             width: "100%",
//             minWidth: "900px", // Ensures columns are always visible!
//             borderCollapse: "collapse",
//             background: "#fff",
//             borderRadius: 12,
//             boxShadow: "0 2px 12px #0001"
//           }}>
//             <thead style={{ background: "#e0e7ef" }}>
//               <tr>
//                 <th style={cell}>Student Name</th>
//                 <th style={cell}>Email</th>
//                 <th style={cell}>Class</th>
//                 <th style={cell}>Quiz Title</th>
//                 <th style={cell}>Quiz Class</th>
//                 <th style={cell}>Score (%)</th>
//                 <th style={cell}>Attempt Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredAttempts.map((a) => {
//                 const stu = getStudent(a.userId);
//                 const quiz = getQuiz(a.quizId);
//                 return (
//                   <tr key={a.id}>
//                     <td style={cell}>{stu.name || "--"}</td>
//                     <td style={cell}>{stu.email || "--"}</td>
//                     <td style={cell}>{stu.class || "--"}</td>
//                     <td style={cell}>{quiz.title || "--"}</td>
//                     <td style={cell}>{quiz.class || "--"}</td>
//                     <td style={{
//                       ...cell,
//                       color: Number(a.score) >= 90 ? "green" : (Number(a.score) < 40 ? "red" : "#222"),
//                       fontWeight: "bold"
//                     }}>{a.score}</td>
//                     <td style={cell}>{a.timestamp ? (new Date(a.timestamp).toLocaleString()) : "--"}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// function DashboardCard({ title, value }) {
//   return (
//     <div style={styles.card}>
//       <h3 style={styles.cardTitle}>{title}</h3>
//       <p style={styles.cardValue}>{value}</p>
//     </div>
//   );
// }

// const cell = {
//   padding: "10px",
//   borderBottom: "1px solid #e5e7eb",
//   textAlign: "left"
// };
// const filterInput = {
//   padding: "7px 10px",
//   fontSize: "1rem",
//   borderRadius: "7px",
//   border: "1px solid #bbb",
//   marginRight: "0.2rem"
// };
// const styles = {
//   container: {
//     padding: "2rem",
//     backgroundColor: "#f7f8fa",
//     minHeight: "100vh",
//     fontFamily: "'Segoe UI', sans-serif",
//   },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "2rem",
//     flexWrap: "wrap",
//     gap: "1rem",
//   },
//   heading: {
//     fontSize: "1.8rem",
//     fontWeight: "600",
//   },
//   logoutBtn: {
//     backgroundColor: "#ef4444",
//     color: "#fff",
//     padding: "0.5rem 1rem",
//     border: "none",
//     borderRadius: "8px",
//     cursor: "pointer",
//     fontWeight: "500",
//     marginLeft: "1rem",
//   },
//   uploadBtn: {
//     backgroundColor: "#2563eb",
//     color: "#fff",
//     padding: "0.5rem 1rem",
//     border: "none",
//     borderRadius: "8px",
//     cursor: "pointer",
//     fontWeight: "500",
//   },
//   cardGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//     gap: "1.5rem",
//   },
//   card: {
//     background: "#ffffff",
//     borderRadius: "12px",
//     padding: "1.5rem",
//     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
//     textAlign: "center",
//   },
//   cardTitle: {
//     fontSize: "1.1rem",
//     color: "#333",
//     marginBottom: "0.75rem",
//   },
//   cardValue: {
//     fontSize: "2rem",
//     fontWeight: "bold",
//     color: "#2563eb",
//   },
// };
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterQuiz, setFilterQuiz] = useState("");
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const studentSnap = await getDocs(collection(db, "users"));
      const quizSnap = await getDocs(collection(db, "quizzes"));
      const attemptSnap = await getDocs(collection(db, "attempts"));
      setStudents(studentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setQuizzes(quizSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setAttempts(attemptSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchData();
  }, []);

  const highScorers = attempts.filter(a => Number(a.score) >= 90);

  const getStudent = (userId) => students.find(u => u.id === userId) || {};
  const getQuiz = (quizId) => quizzes.find(q => q.id === quizId) || {};

  const filteredAttempts = attempts.filter((a) => {
    const stu = getStudent(a.userId);
    const quiz = getQuiz(a.quizId);
    const searchStr = (search || "").toLowerCase();

    const matchesSearch =
      !searchStr ||
      (stu.name && stu.name.toLowerCase().includes(searchStr)) ||
      (stu.email && stu.email.toLowerCase().includes(searchStr)) ||
      (quiz.title && quiz.title.toLowerCase().includes(searchStr)) ||
      (quiz.class && quiz.class.toString().includes(searchStr)) ||
      (stu.class && stu.class.toString().includes(searchStr));

    const matchesClass = !filterClass || stu.class === filterClass;
    const matchesQuiz = !filterQuiz || quiz.id === filterQuiz;

    const numScore = Number(a.score);
    const matchesScore =
      (!minScore || numScore >= Number(minScore)) &&
      (!maxScore || numScore <= Number(maxScore));

    const attemptDate = a.timestamp ? new Date(a.timestamp) : null;
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;
    const matchesFrom = !fromDate || (attemptDate && attemptDate >= fromDate);
    const matchesTo = !toDate || (attemptDate && attemptDate <= toDate);

    return matchesSearch && matchesClass && matchesQuiz && matchesScore && matchesFrom && matchesTo;
  });

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2 className="admin-heading">Welcome, Admin 👋</h2>
        <div>
          <button onClick={() => navigate("/upload-quiz")} className="upload-btn">
            ➕ Upload Quiz
          </button>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="admin-card-grid">
        <DashboardCard title="Total Students" value={students.length} />
        <DashboardCard title="Total Quizzes" value={quizzes.length} />
        <DashboardCard title="Total Attempts" value={attempts.length} />
        <DashboardCard title="90%+ Scorers" value={highScorers.length} />
      </div>

      <div className="filter-bar">
        <input placeholder="🔍 Search…" value={search} onChange={e => setSearch(e.target.value)} className="filter-input" />
        <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="filter-input">
          <option value="">All Classes</option>
          {[...new Set(students.map(stu => stu.class).filter(Boolean))].map(cls =>
            <option key={cls} value={cls}>{cls}</option>
          )}
        </select>
        <select value={filterQuiz} onChange={e => setFilterQuiz(e.target.value)} className="filter-input">
          <option value="">All Quizzes</option>
          {quizzes.map(q =>
            <option key={q.id} value={q.id}>{q.title}</option>
          )}
        </select>
        <input type="number" placeholder="Min %" value={minScore} onChange={e => setMinScore(e.target.value)} className="filter-input" />
        <span>-</span>
        <input type="number" placeholder="Max %" value={maxScore} onChange={e => setMaxScore(e.target.value)} className="filter-input" />
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="filter-input" />
        <span>to</span>
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="filter-input" />
        <button
          onClick={() => {
            setSearch(""); setFilterClass(""); setFilterQuiz("");
            setMinScore(""); setMaxScore(""); setDateFrom(""); setDateTo("");
          }}
          className="reset-btn"
        >
          Reset
        </button>
      </div>

      <h3 className="table-heading">All Quiz Attempts</h3>
      {loading ? (
        <p>Loading data…</p>
      ) : filteredAttempts.length === 0 ? (
        <p>No matching attempts found.</p>
      ) : (
        <div className="table-container">
          <table className="attempt-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Class</th>
                <th>Quiz Title</th>
                <th>Quiz Class</th>
                <th>Score (%)</th>
                <th>Attempt Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttempts.map((a) => {
                const stu = getStudent(a.userId);
                const quiz = getQuiz(a.quizId);
                return (
                  <tr key={a.id}>
                    <td>{stu.name || "--"}</td>
                    <td>{stu.email || "--"}</td>
                    <td>{stu.class || "--"}</td>
                    <td>{quiz.title || "--"}</td>
                    <td>{quiz.class || "--"}</td>
                    <td className={a.score >= 90 ? "score-high" : a.score < 40 ? "score-low" : ""}>{a.score}</td>
                    <td>{a.timestamp ? (new Date(a.timestamp).toLocaleString()) : "--"}</td>
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

function DashboardCard({ title, value }) {
  return (
    <div className="admin-card">
      <h3 className="admin-card-title">{title}</h3>
      <p className="admin-card-value">{value}</p>
    </div>
  );
}
