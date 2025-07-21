import React from "react";

export default function QuizTable({ quizzes, loading, handleEdit, handleDelete }) {
  return (
    <>
      <h2>Manage Uploaded Quizzes</h2>
      {loading ? (
        <p>Loading quizzes...</p>
      ) : quizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Class</th>
              <th>Total Questions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz.id}>
                <td>{quiz.title}</td>
                <td>{quiz.class}</td>
                <td>{quiz.questions?.length || 0}</td>
                <td>
                  <button style={{
                    marginRight: "0.5rem",
                    padding: "0.3rem 0.8rem",
                    backgroundColor: "#3b82f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }} onClick={() => handleEdit(quiz)}>Edit</button>
                  <button style={{
                    padding: "0.3rem 0.8rem",
                    backgroundColor: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }} onClick={() => handleDelete(quiz.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
