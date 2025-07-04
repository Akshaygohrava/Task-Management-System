import { useNavigate } from "react-router-dom";
import "./welcome.css";
import { useTheme } from "../context/ThemeContext";

const features = [
  {
    title: "User Authentication",
    desc: "Securely sign up, log in, and manage your access.",
  },
  {
    title: "Task Management",
    desc: "Create, edit, delete, and manage your tasks easily.",
  },
  {
    title: "Category & Prioritize",
    desc: "Organize tasks by category and set priorities.",
  },
  {
    title: "Dashboard & Progress Tracker",
    desc: "Track your productivity with a smart visual dashboard.",
  },
];

const Welcome = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();

  return (
    <div className={`welcome-page ${darkMode ? "dark-mode" : "light-mode"}`}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="theme-toggle-btn"
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="welcome-container">
        <h1>
          Welcome to <span className="brand">PLANNINGS</span>!
        </h1>
        <p>Organize your tasks. Track your goals. Stay productive.</p>

        <h2 className="features-heading">What You Can Do with PLANNINGS 👇</h2>

        <div className="feature-cards-wrapper">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <h2>{feature.title}</h2>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>

        <button onClick={() => navigate("/signup")} className="get-started-btn">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Welcome;
