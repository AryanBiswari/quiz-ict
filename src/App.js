import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Lazy load pages
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const QuizList = lazy(() => import("./pages/QuizList"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const UploadQuiz = lazy(() => import("./pages/UploadQuiz"));
const QuizAttempt = lazy(() => import("./pages/QuizAttempt"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const AttemptReview = lazy(() => import("./pages/AttemptReview"));

function App() {
  const { user, needsOnboarding } = useAuth();
  const adminEmails = ["aryanbiswari14@gmail.com"]; // ✅ Replace with real ones
  const isAdmin = user && adminEmails.includes(user.email);

  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{padding:"3rem",textAlign:"center",fontSize:"1.3rem"}}>Loading...</div>}>
        <Routes>
          {/* Public login route */}
          <Route
            path="/login"
            element={
              !user ? (
                <LoginPage />
              ) : isAdmin ? (
                <Navigate to="/admin" />
              ) : needsOnboarding ? (
                <Navigate to="/onboarding" />
              ) : (
                <Navigate to="/quiz-list" />
              )
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/upload-quiz"
            element={isAdmin ? <UploadQuiz /> : <Navigate to="/login" />}
          />

          {/* Onboarding */}
          <Route
            path="/onboarding"
            element={
              user && !isAdmin && needsOnboarding ? (
                <OnboardingPage />
              ) : !user ? (
                <Navigate to="/login" />
              ) : isAdmin ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/quiz-list" />
              )
            }
          />

          {/* Quiz List */}
          <Route
            path="/quiz-list"
            element={
              user && !isAdmin && !needsOnboarding ? (
                <QuizList />
              ) : !user ? (
                <Navigate to="/login" />
              ) : isAdmin ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/onboarding" />
              )
            }
          />

          {/* Quiz Attempt (Student) */}
          <Route
            path="/quiz/:id"
            element={
              user && !isAdmin && !needsOnboarding ? (
                <QuizAttempt />
              ) : !user ? (
                <Navigate to="/login" />
              ) : isAdmin ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/onboarding" />
              )
            }
          />

          {/* Attempt Review */}
          <Route path="/attempt/:attemptId" element={<AttemptReview />} />

          {/* Leaderboard */}
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* Catch-all */}
          <Route
            path="*"
            element={
              !user ? (
                <Navigate to="/login" />
              ) : isAdmin ? (
                <Navigate to="/admin" />
              ) : needsOnboarding ? (
                <Navigate to="/onboarding" />
              ) : (
                <Navigate to="/quiz-list" />
              )
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;



