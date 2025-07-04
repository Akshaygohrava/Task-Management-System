import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { Link } from "react-router-dom"; // ✅ Added for back button
import "./ProgressTracker.css";
import { useTheme } from "../../context/ThemeContext";

const COLORS = ["#00C49F", "#FF8042"];

const ProgressTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const { darkMode } = useTheme();

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);

    const completed = storedTasks.filter((t) => t.completed).length;
    const pending = storedTasks.length - completed;

    setChartData([
      { name: "Completed", value: completed },
      { name: "Pending", value: pending },
    ]);

    const grouped = storedTasks.reduce((acc, t) => {
      const cat = t.category || "Uncategorized";
      acc[cat] = acc[cat] || { total: 0, completed: 0 };
      acc[cat].total++;
      if (t.completed) acc[cat].completed++;
      return acc;
    }, {});

    const stats = Object.entries(grouped).map(([category, stats]) => ({
      category,
      total: stats.total,
      completed: stats.completed,
      percent:
        stats.total > 0
          ? Math.round((stats.completed / stats.total) * 100)
          : 0,
    }));

    setCategoryStats(stats);

    // Weekly trend data (mock example)
    const trend = [
      { day: "Mon", completed: 2 },
      { day: "Tue", completed: 3 },
      { day: "Wed", completed: 1 },
      { day: "Thu", completed: 4 },
      { day: "Fri", completed: 2 },
      { day: "Sat", completed: 0 },
      { day: "Sun", completed: 0 },
    ];
    setWeeklyTrend(trend);
  }, []);

  const overallPercent = tasks.length
    ? Math.round(
        (tasks.filter((t) => t.completed).length / tasks.length) * 100
      )
    : 0;

  const streakDays = 3; // Example
  const weeklyGoal = 20; // Example
  const tasksCompletedThisWeek = weeklyTrend.reduce(
    (sum, d) => sum + d.completed,
    0
  );
  const weeklyGoalPercent = Math.round(
    (tasksCompletedThisWeek / weeklyGoal) * 100
  );

  return (
    <div className={`progress-wrapper ${darkMode ? "dark" : "light"}`}>
      <div className={`progress-container ${darkMode ? "dark" : "light"}`}>
        {/* ✅ Back Button */}
        <div className="back-button-wrapper">
          <Link to="/Dashboard" className="back-button">
            ⬅ Back to Dashboard
          </Link>
        </div>

        <h2>📊 Progress Tracker</h2>

        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Completed</h3>
            <p className="value">{tasks.filter((t) => t.completed).length}</p>
            <span className="note">{tasks.length} total tasks</span>
          </div>
          <div className="summary-card">
            <h3>Overall Progress</h3>
            <p className="value">{overallPercent}%</p>
            <span className="note">Keep going!</span>
          </div>
          <div className="summary-card">
            <h3>Streak 🔥</h3>
            <p className="value">{streakDays} days</p>
            <span className="note">Daily completion streak</span>
          </div>
          <div className="summary-card">
            <h3>Weekly Goal</h3>
            <p className="value">{weeklyGoalPercent}%</p>
            <span className="note">
              {tasksCompletedThisWeek}/{weeklyGoal} tasks this week
            </span>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-box">
            <h4>Progress by Category</h4>
            {categoryStats.length === 0 ? (
              <p className="empty-msg">No tasks yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="percent"
                    fill="#696FF6"
                    barSize={40}
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="chart-box">
            <h4>Completion Overview</h4>
            <div className="completion-pie">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-center">
                <span>{overallPercent}%</span>
                <p>Done</p>
              </div>
            </div>
          </div>

          <div className="chart-box">
            <h4>Weekly Trend</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#00C49F"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="category-details">
          <h4>Category Details</h4>
          {categoryStats.map((cat, i) => (
            <div key={i} className="category-detail-row">
              <div className="detail-header">
                <span>{cat.category}</span>
                <span>{cat.percent}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${cat.percent}%` }}
                ></div>
              </div>
              <span className="sub-note">
                {cat.completed} of {cat.total} tasks completed
              </span>
            </div>
          ))}
        </div>

        <div className="motivation-box">
          💡 Keep up the momentum! Consistency is key.
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
