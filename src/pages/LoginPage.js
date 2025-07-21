import "./LoginPage.css";
import { useAuth } from "../contexts/AuthContext";
import loginImage from "../assets/TS.png"; // move your image to src/assets
import googleLogo from "../assets/g-logo.png"; // download g-logo if needed

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="login-container">
      {/* Left Panel */}
      <div className="login-left">
        <h1 className="login-title">
          Welcome to
          <br />
          Quiz Platform
        </h1>
        <button onClick={loginWithGoogle} className="login-button">
          <img src={googleLogo} alt="Google" className="google-logo" />
          <span>Sign in with Google</span>
        </button>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <img
          src={loginImage}
          alt="Teacher and student"
          className="login-image"
        />
      </div>
    </div>
  );
}

