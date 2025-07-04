import { Link } from "react-router-dom";
import "./authStyle.css";
import { useTheme } from "../../context/ThemeContext";

const Signup = () => {
  const { darkMode } = useTheme();

  return (
    <div className="auth-wrapper">
      <div className={`auth-container ${darkMode ? "dark" : "light"}`}>
        <p>Welcome to the organized side of the world</p>
        <h1>
          PLANNINGS <span class="spn">!</span>
        </h1>

        <form>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Signup</button>
        </form>

        <p>
          Tasks won't finish themselves <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
