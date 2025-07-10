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
import { Link } from "react-router-dom";
import "./ProgressTracker.css";
import { useTheme } from "../../context/ThemeContext";

// Pie colors
const COLORS = ["#00C49F", "#FF8042"];

// Helper: get YYYY-MM-DD for Date object
const formatDate = (date) =>
  date.toISOString().split("T")[0];

// Helper: get week range
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay(); // Sun=0, Mon=1,...Sat=6
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const ProgressTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [streakDays, setStreakDays] = useState(0);
  const { darkMode } = useTheme();

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);

    const today = new Date();
    const todayStr = formatDate(today);

    // 1️⃣ Calculate streak: get unique completed dates
    const completedDates = storedTasks
      .filter((t) => t.status === "Completed" && t.date)
      .map((t) => t.date);

    const uniqueDates = Array.from(new Set(completedDates)).sort().reverse();

    let streak = 0;
    let currentDate = new Date(todayStr);

    while (true) {
      const currentDateStr = formatDate(currentDate);
      if (uniqueDates.includes(currentDateStr)) {
        streak += 1;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    setStreakDays(streak);

    // 2️⃣ Calculate weekly goal progress and trend
    const startOfWeek = getStartOfWeek(today);
    const trendMap = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    storedTasks.forEach((t) => {
      if (t.status === "Completed" && t.date) {
        const taskDate = new Date(t.date + "T00:00:00");
        if (taskDate >= startOfWeek && taskDate <= today) {
          const dayName = days[taskDate.getDay()];
          trendMap[dayName] = (trendMap[dayName] || 0) + 1;
        }
      }
    });

    const trend = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => ({
      day: d,
      completed: trendMap[d] || 0,
    }));

    setWeeklyTrend(trend);

    // 3️⃣ Pie chart data
    const completed = storedTasks.filter((t) => t.status === "Completed").length;
    const pending = storedTasks.length - completed;
    setChartData([
      { name: "Completed", value: completed },
      { name: "Pending", value: pending },
    ]);

    // 4️⃣ Category stats
    const grouped = storedTasks.reduce((acc, t) => {
      const cat = t.category || "Uncategorized";
      acc[cat] = acc[cat] || { total: 0, completed: 0 };
      acc[cat].total++;
      if (t.status === "Completed") acc[cat].completed++;
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
  }, []);

  const overallPercent = tasks.length
    ? Math.round(
        (tasks.filter((t) => t.status === "Completed").length / tasks.length) * 100
      )
    : 0;

  const weeklyGoal = 10; // ✅ you can change this!
  const tasksCompletedThisWeek = weeklyTrend.reduce((sum, d) => sum + d.completed, 0);
  const weeklyGoalPercent = Math.min(
    Math.round((tasksCompletedThisWeek / weeklyGoal) * 100),
    100
  );

  return (
    <div className={`progress-wrapper ${darkMode ? "dark" : "light"}`}>
      <div className={`progress-container ${darkMode ? "dark" : "light"}`}>
        <div className="back-button-wrapper">
          <Link to="/Dashboard" className="back-button">
            ⬅ Back to Dashboard
          </Link>
        </div>

        <h2>📊 Progress Tracker</h2>

        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Completed</h3>
            <p className="value">
              {tasks.filter((t) => t.status === "Completed").length}
            </p>
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
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
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
         {/* ✅ Add beautiful footer here */}
      <footer className="app-footer">
  <p>
    © <a href="https://www.calanjiyam.com" target="_blank" rel="noopener noreferrer">
      Calanjiyam Consultancies and Technologies
    </a> 2025 | TEAM-3 REACT + SPRINGBOOT
  </p>
  <p>
    Shreya Jha | Akshay Gohrava | Dhruvil Purohit | Vinay Jaiswar
  </p>
</footer>
      </div>
    </div>
  );
};

export default ProgressTracker;
