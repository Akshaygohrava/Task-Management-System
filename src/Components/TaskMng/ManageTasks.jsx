import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ManageTasks.css";
import { useTheme } from "../../context/ThemeContext";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editTask, setEditTask] = useState({});
  const { theme } = useTheme();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(stored);
  }, []);

  const update = (data) => {
    setTasks(data);
    localStorage.setItem("tasks", JSON.stringify(data));
  };

  const handleEdit = (idx) => {
    setEditIndex(idx);
    setEditTask(tasks[idx]);
  };

  const handleSave = () => {
    const updated = tasks.map((t, i) =>
      i === editIndex ? editTask : t
    );
    update(updated);
    setEditIndex(null);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditTask({});
  };

  return (
    <div className={`manage-task-wrapper ${theme}`}>
      <div className={`manage-task-container ${theme}`}>
        {/* ✅ Back to Dashboard button */}
        <div className="back-button-wrapper">
          <Link to="/Dashboard" className="back-button">
            ⬅ Back to Dashboard
          </Link>
        </div>

        <h2>🗂️ Manage Tasks</h2>

        {tasks.length === 0 ? (
          <p className={`empty-msg ${theme}`}>No tasks added yet.</p>
        ) : (
          <div className="task-list">
            {tasks.map((t, i) => (
              <div
                key={i}
                className={`task-card ${theme} ${t.completed ? "completed" : ""}`}
              >
                <div className="task-header">
                  <h3>{t.taskName}</h3>
                  <span className={`status-badge ${t.completed ? "completed" : "pending"}`}>
                    {t.completed ? "Completed" : "Pending"}
                  </span>
                </div>

                <div className="task-info">
                  <p>{t.description}</p>
                  <small>
                    📂 {t.category} | ⚡ {t.priority} | 📅 {t.date}
                  </small>
                </div>

                <div className="task-actions">
                  <button
                    className="complete-btn"
                    onClick={() =>
                      update(
                        tasks.map((task, idx) =>
                          idx === i
                            ? { ...task, completed: !task.completed }
                            : task
                        )
                      )
                    }
                  >
                    {t.completed ? "↩️ Undo" : "✅ Complete"}
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(i)}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => update(tasks.filter((_, idx) => idx !== i))}
                  >
                    🗑️ Delete
                  </button>
                </div>

                {editIndex === i && (
                  <div className="edit-form">
                    <input
                      type="text"
                      placeholder="Task Name"
                      value={editTask.taskName}
                      onChange={(e) =>
                        setEditTask({ ...editTask, taskName: e.target.value })
                      }
                    />
                    <textarea
                      placeholder="Description"
                      value={editTask.description}
                      onChange={(e) =>
                        setEditTask({ ...editTask, description: e.target.value })
                      }
                    ></textarea>
                    <input
                      type="text"
                      placeholder="Category"
                      value={editTask.category}
                      onChange={(e) =>
                        setEditTask({ ...editTask, category: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Priority"
                      value={editTask.priority}
                      onChange={(e) =>
                        setEditTask({ ...editTask, priority: e.target.value })
                      }
                    />
                    <input
                      type="date"
                      value={editTask.date}
                      onChange={(e) =>
                        setEditTask({ ...editTask, date: e.target.value })
                      }
                    />

                    <div className="edit-actions">
                      <button className="save-btn" onClick={handleSave}>
                        💾 Save
                      </button>
                      <button className="cancel-btn" onClick={handleCancel}>
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTasks;
