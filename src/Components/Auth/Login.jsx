import { Link, useNavigate } from "react-router-dom";
import "./authStyle.css";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";

const Login = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (email && password) {
      localStorage.setItem("isLoggedIn", true);

      navigate("/dashboard");
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className={`auth-container ${darkMode ? "dark" : "light"}`}>
        <p>Welcome Back To</p>
        <h1>
          PLANNINGS <span class="spn">!</span>
        </h1>
        <p>Turn chaos into checklists.</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>

        <p>
          Get in, get organized <Link to="/signup">Sign up!</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
