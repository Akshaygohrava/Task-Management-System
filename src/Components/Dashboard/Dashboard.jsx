import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { FaPlus, FaChartBar, FaCog } from "react-icons/fa";
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  return (
    <div className={`dashboard-container ${darkMode ? "dark" : "light"}`}>
      <header className="dashboard-header">
        <h1>What would you like to do today?</h1>
        <p>
          Choose an option below to manage your tasks or track your progress
        </p>
      </header>

      <div className="dashboard-cards">
        <div className="dashboard-card" onClick={() => navigate("/add-task")}>
          <FaPlus className="card-icon" />
          <h2>Add Tasks</h2>
          <p>Create and organize new tasks with priorities</p>
          <small>Tap here to add tasks +</small>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/manage-tasks")}
        >
          <FaCog className="card-icon" />
          <h2>Manage Tasks</h2>
          <p>Edit, delete, and organize existing tasks</p>
          <small>Tap here to manage tasks ⚙️</small>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/track-progress")}
        >
          <FaChartBar className="card-icon" />
          <h2>Track Progress</h2>
          <p>View detailed analytics and progress charts</p>
          <small>Tap here to track your progress 📊</small>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
