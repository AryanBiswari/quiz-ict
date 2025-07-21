// import React, { useEffect, useState } from "react";
// import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
// import { db } from "../firebase";

// // Import modular components
// import QuizToast from "../components/admin/QuizToast";
// import QuizEditModal from "../components/admin/QuizEditModal";
// import QuizCreateForm from "../components/admin/QuizCreateForm";
// import QuizTable from "../components/admin/QuizTable";

// export default function UploadQuiz() {
//   const [quizzes, setQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingQuiz, setEditingQuiz] = useState(null);
//   const [toast, setToast] = useState("");

//   // Create quiz state
//   const [quizTitle, setQuizTitle] = useState("");
//   const [quizClass, setQuizClass] = useState("");
//   const [questions, setQuestions] = useState([
//     { question: "", options: ["", "", "", ""], answer: "" }
//   ]);

//   // Fetch quizzes
//   const fetchQuizzes = async () => {
//     setLoading(true);
//     const snap = await getDocs(collection(db, "quizzes"));
//     const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     setQuizzes(data);
//     setLoading(false);
//   };

//   useEffect(() => { fetchQuizzes(); }, []);

//   // --- CREATE a new quiz ---
//   const handleCreateQuiz = async (e) => {
//     e.preventDefault();
//     try {
//       await addDoc(collection(db, "quizzes"), {
//         title: quizTitle,
//         class: quizClass,
//         questions
//       });
//       setToast("✅ Quiz created!");
//       setQuizTitle("");
//       setQuizClass("");
//       setQuestions([{ question: "", options: ["", "", "", ""], answer: "" }]);
//       fetchQuizzes();
//     } catch {
//       setToast("❌ Error creating quiz!");
//     }
//   };

//   // --- DELETE Quiz ---
//   const handleDelete = async (quizId) => {
//     const confirmed = window.confirm("Are you sure you want to delete this quiz?");
//     if (!confirmed) return;
//     try {
//       await deleteDoc(doc(db, "quizzes", quizId));
//       setToast("✅ Quiz deleted!");
//       fetchQuizzes();
//     } catch {
//       setToast("❌ Error deleting quiz!");
//     }
//   };

//   // --- EDIT Quiz logic ---
//   const handleEdit = (quiz) => {
//     setEditingQuiz({ ...quiz }); // open modal with quiz data
//   };

//   // --- SAVE Edited quiz ---
//   const handleSaveEdit = async (form) => {
//     try {
//       await updateDoc(doc(db, "quizzes", form.id), {
//         title: form.title,
//         class: form.class,
//         questions: form.questions
//       });
//       setToast("✅ Quiz updated!");
//       setEditingQuiz(null);
//       fetchQuizzes();
//     } catch {
//       setToast("❌ Error updating quiz!");
//     }
//   };

//   // --- UI ---
//   return (
//     <div style={{ padding: "2rem", fontFamily: "'Segoe UI', sans-serif" }}>
//       <h2>Upload/Create Quiz</h2>
//       <QuizToast message={toast} onClose={() => setToast("")} />
//       <QuizEditModal
//         quiz={editingQuiz}
//         onCancel={() => setEditingQuiz(null)}
//         onSave={handleSaveEdit}
//       />

//       {/* CREATE FORM */}
//       <QuizCreateForm
//         quizTitle={quizTitle}
//         setQuizTitle={setQuizTitle}
//         quizClass={quizClass}
//         setQuizClass={setQuizClass}
//         questions={questions}
//         setQuestions={setQuestions}
//         handleCreateQuiz={handleCreateQuiz}
//       />

//       <QuizTable
//         quizzes={quizzes}
//         loading={loading}
//         handleEdit={handleEdit}
//         handleDelete={handleDelete}
//       />
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

import QuizToast from "../components/admin/QuizToast";
import QuizEditModal from "../components/admin/QuizEditModal";
import QuizCreateForm from "../components/admin/QuizCreateForm";
import QuizTable from "../components/admin/QuizTable";

import "./UploadQuiz.css";

export default function UploadQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [toast, setToast] = useState("");

  const [quizTitle, setQuizTitle] = useState("");
  const [quizClass, setQuizClass] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], answer: "" }
  ]);

  const fetchQuizzes = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "quizzes"));
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setQuizzes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "quizzes"), {
        title: quizTitle,
        class: quizClass,
        questions
      });
      setToast("✅ Quiz created!");
      setQuizTitle("");
      setQuizClass("");
      setQuestions([{ question: "", options: ["", "", "", ""], answer: "" }]);
      fetchQuizzes();
    } catch {
      setToast("❌ Error creating quiz!");
    }
  };

  const handleDelete = async (quizId) => {
    const confirmed = window.confirm("Are you sure you want to delete this quiz?");
    if (!confirmed) return;
    try {
      await deleteDoc(doc(db, "quizzes", quizId));
      setToast("✅ Quiz deleted!");
      fetchQuizzes();
    } catch {
      setToast("❌ Error deleting quiz!");
    }
  };

  const handleEdit = (quiz) => {
    setEditingQuiz({ ...quiz });
  };

  const handleSaveEdit = async (form) => {
    try {
      await updateDoc(doc(db, "quizzes", form.id), {
        title: form.title,
        class: form.class,
        questions: form.questions
      });
      setToast("✅ Quiz updated!");
      setEditingQuiz(null);
      fetchQuizzes();
    } catch {
      setToast("❌ Error updating quiz!");
    }
  };

  return (
    <div className="upload-quiz-container">
      <h2>Upload/Create Quiz</h2>

      <QuizToast message={toast} onClose={() => setToast("")} />
      <QuizEditModal
        quiz={editingQuiz}
        onCancel={() => setEditingQuiz(null)}
        onSave={handleSaveEdit}
      />

      <QuizCreateForm
        quizTitle={quizTitle}
        setQuizTitle={setQuizTitle}
        quizClass={quizClass}
        setQuizClass={setQuizClass}
        questions={questions}
        setQuestions={setQuestions}
        handleCreateQuiz={handleCreateQuiz}
      />

      <QuizTable
        quizzes={quizzes}
        loading={loading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}
