import React, { useState } from "react";
import "./ManageTasks.css";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([
    {
      taskName: "First To Do",
      description: "This is a to-do task",
      status: "To Do",
      category: "Work",
      priority: "High",
      date: "2025-07-07"
    },
    {
      taskName: "Second In Progress",
      description: "This is in progress",
      status: "In Progress",
      category: "Personal",
      priority: "Medium",
      date: "2025-07-08"
    },
    {
      taskName: "Third Completed",
      description: "This one is done",
      status: "Completed",
      category: "Other",
      priority: "Low",
      date: "2025-07-09"
    }
  ]);

  // Kanban Columns
  const todoTasks = tasks.filter((task) => task.status === "To Do");
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress");
  const completedTasks = tasks.filter((task) => task.status === "Completed");

  // Update Task Status
  const updateStatus = (idx, newStatus) => {
    const updated = tasks.map((t, i) =>
      i === idx ? { ...t, status: newStatus } : t
    );
    setTasks(updated);
  };

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

// === Kanban Column ===
const KanbanColumn = ({ title, tasks, allTasks, updateStatus }) => (
  <div className="kanban-column">
    <h3>{title}</h3>
    {tasks.length === 0 ? (
      <p>No tasks</p>
    ) : (
      tasks.map((t) => {
        const idx = allTasks.findIndex((task) => task === t);
        return (
          <TaskCard
            key={idx}
            task={t}
            idx={idx}
            updateStatus={updateStatus}
          />
        );
      })
    )}
  </div>
);

// === Task Card ===
const TaskCard = ({ task, idx, updateStatus }) => (
  <div className="task-card">
    <div className="task-header">
      <h4>{task.taskName}</h4>
      <span className="status-badge">{task.status}</span>
    </div>
    <div className="task-info">
      <p>{task.description}</p>
      <small>
        📂 {task.category} | ⚡ {task.priority} | 📅 {task.date}
      </small>
    </div>
    <div className="task-actions">
      {task.status === "To Do" && (
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
