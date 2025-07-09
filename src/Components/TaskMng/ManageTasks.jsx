import React, { useState, useEffect } from "react";
import "./ManageTasks.css";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(saved);
  }, []);

  // Update task status and save back to localStorage
  const updateStatus = (idx, newStatus) => {
    const updated = tasks.map((t, i) =>
      i === idx ? { ...t, status: newStatus } : t
    );
    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
  };

  // Kanban Columns
  const todoTasks = tasks.filter((task) => !task.status || task.status === "To Do");
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress");
  const completedTasks = tasks.filter((task) => task.status === "Completed");

  return (
    <div className="manage-task-wrapper">
      <h2>🗂️ Manage Tasks (Kanban Board)</h2>

      <div className="kanban-board">
        <KanbanColumn
          title="📝 To Do"
          tasks={todoTasks}
          allTasks={tasks}
          updateStatus={updateStatus}
        />
        <KanbanColumn
          title="🚧 In Progress"
          tasks={inProgressTasks}
          allTasks={tasks}
          updateStatus={updateStatus}
        />
        <KanbanColumn
          title="✅ Completed"
          tasks={completedTasks}
          allTasks={tasks}
          updateStatus={updateStatus}
        />
      </div>
    </div>
  );
};

const KanbanColumn = ({ title, tasks, allTasks, updateStatus }) => (
  <div className="kanban-column">
    <h3>{title}</h3>
    {tasks.length === 0 ? (
      <p>No tasks</p>
    ) : (
      tasks.map((t) => {
        const idx = allTasks.findIndex((task) => task === t);
        return (
          <TaskCard key={idx} task={t} idx={idx} updateStatus={updateStatus} />
        );
      })
    )}
  </div>
);

const TaskCard = ({ task, idx, updateStatus }) => (
  <div className="task-card">
    <div className="task-header">
      <h4>{task.taskName}</h4>
      <span className="status-badge">{task.status || "To Do"}</span>
    </div>
    <div className="task-info">
      <p>{task.description}</p>
      <small>
        📂 {task.category} | ⚡ {task.priority} | 📅 {task.date}
      </small>
    </div>
    <div className="task-actions">
      {(!task.status || task.status === "To Do") && (
        <button
          className="inprogress-btn"
          onClick={() => updateStatus(idx, "In Progress")}
        >
          🚧 Start Progress
        </button>
      )}
      {task.status !== "Completed" && (
        <button
          className="complete-btn"
          onClick={() => updateStatus(idx, "Completed")}
        >
          ✅ Mark Complete
        </button>
      )}
    </div>
  </div>
);

export default ManageTasks;
