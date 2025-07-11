import React, { useState, useEffect } from "react";
import "./ManageTasks.css";
import { Link } from "react-router-dom";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(saved);
  }, []);

  const updateStatus = (idx, newStatus) => {
    const updated = tasks.map((t, i) =>
      i === idx ? { ...t, status: newStatus } : t
    );
    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
  };

  const deleteTask = (idx) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const updated = tasks.filter((_, i) => i !== idx);
      setTasks(updated);
      localStorage.setItem("tasks", JSON.stringify(updated));
    }
  };

  const saveEditedTask = (idx, editedTask) => {
    const updated = tasks.map((t, i) =>
      i === idx ? { ...t, ...editedTask } : t
    );
    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
  };

  const todoTasks = tasks.filter((task) => !task.status || task.status === "To Do");
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress");
  const completedTasks = tasks.filter((task) => task.status === "Completed");

  return (
    <div className="manage-task-wrapper">
      <div className="back-button-wrapper">
        <Link to="/Dashboard" className="back-button">
          ⬅ Back to Dashboard
        </Link>
      </div>

      <h2>🗂️ Manage Tasks (Kanban Board)</h2>

      <div className="kanban-board">
        {todoTasks.length > 0 && (
          <KanbanColumn
            title="📝 To Do"
            tasks={todoTasks}
            allTasks={tasks}
            updateStatus={updateStatus}
            deleteTask={deleteTask}
            saveEditedTask={saveEditedTask}
          />
        )}

        {inProgressTasks.length > 0 && (
          <KanbanColumn
            title="🚧 In Progress"
            tasks={inProgressTasks}
            allTasks={tasks}
            updateStatus={updateStatus}
            deleteTask={deleteTask}
            saveEditedTask={saveEditedTask}
          />
        )}

        {completedTasks.length > 0 && (
          <KanbanColumn
            title="✅ Completed"
            tasks={completedTasks}
            allTasks={tasks}
            updateStatus={updateStatus}
            deleteTask={deleteTask}
            saveEditedTask={saveEditedTask}
          />
        )}
      </div>

    
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
  );
};

const KanbanColumn = ({
  title,
  tasks,
  allTasks,
  updateStatus,
  deleteTask,
  saveEditedTask,
}) => (
  <div className="kanban-column">
    <h3>{title}</h3>
    {tasks.map((t) => {
      const idx = allTasks.findIndex((task) => task === t);
      return (
        <TaskCard
          key={idx}
          task={t}
          idx={idx}
          updateStatus={updateStatus}
          deleteTask={deleteTask}
          saveEditedTask={saveEditedTask}
        />
      );
    })}
  </div>
);

const TaskCard = ({ task, idx, updateStatus, deleteTask, saveEditedTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTaskName, setEditedTaskName] = useState(task.taskName);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const handleSave = () => {
    saveEditedTask(idx, {
      taskName: editedTaskName,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const statusClass =
    task.status === "Completed"
      ? "badge-completed"
      : task.status === "In Progress"
      ? "badge-inprogress"
      : "badge-todo";

  return (
    <div className="task-card">
      <div className="task-header">
        {isEditing ? (
          <input
            value={editedTaskName}
            onChange={(e) => setEditedTaskName(e.target.value)}
          />
        ) : (
          <h4>{task.taskName}</h4>
        )}
        <span className={`status-badge ${statusClass}`}>
          {task.status || "To Do"}
        </span>
      </div>

      <div className="task-info">
        {isEditing ? (
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            rows={3}
          />
        ) : (
          <p>{task.description}</p>
        )}
        <small>
          📂 {task.category} | ⚡ {task.priority} | 📅 {task.date}
        </small>
      </div>

      <div className="task-actions">
        {isEditing ? (
          <>
            <button className="save-btn" onClick={handleSave}>💾 Save</button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>❌ Cancel</button>
          </>
        ) : (
          <>
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
            {(task.status === "To Do" || task.status === "In Progress") && (
              <button
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit
              </button>
            )}
            <button
              className="delete-btn"
              onClick={() => deleteTask(idx)}
            >
              🗑️ Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageTasks;
