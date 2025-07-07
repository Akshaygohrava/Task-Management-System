import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ManageTasks.css";
import { useTheme } from "../../context/ThemeContext";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editTask, setEditTask] = useState({});
  const { theme } = useTheme();

  // Filters
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

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

  // Filter logic
  const filteredTasks = tasks.filter((task) => {
    const matchSearch =
      task.taskName.toLowerCase().includes(searchText.toLowerCase()) ||
      task.description.toLowerCase().includes(searchText.toLowerCase());
    const matchCategory = categoryFilter ? task.category === categoryFilter : true;
    const matchPriority = priorityFilter ? task.priority === priorityFilter : true;
    return matchSearch && matchCategory && matchPriority;
  });

  // NEW: Split filtered tasks into pending & completed
  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  return (
    <div className={`manage-task-wrapper ${theme}`}>
      <div className="back-button-wrapper">
        <Link to="/Dashboard" className="back-button">
          ⬅ Back to Dashboard
        </Link>
      </div>

      <div className={`manage-task-container ${theme}`}>
        <h2>🗂️ Manage Tasks</h2>

        {/* ✅ Filters */}
        <div className="filter-section">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {filteredTasks.length === 0 ? (
          <p className={`empty-msg ${theme}`}>No tasks found.</p>
        ) : (
          <div className="multi-task-lists">

            {/* ✅ Pending Tasks */}
            <div className="task-section">
              <h3>🕒 Pending Tasks</h3>
              {pendingTasks.length === 0 ? (
                <p className="empty-msg">No pending tasks.</p>
              ) : (
                <div className="task-list">
                  {pendingTasks.map((t, i) => {
                    const actualIndex = tasks.findIndex(task => task === t);
                    return (
                      <TaskCard
                        key={actualIndex}
                        task={t}
                        idx={actualIndex}
                        tasks={tasks}
                        update={update}
                        editIndex={editIndex}
                        editTask={editTask}
                        handleEdit={handleEdit}
                        handleSave={handleSave}
                        handleCancel={handleCancel}
                        setEditTask={setEditTask}
                        theme={theme}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* ✅ Completed Tasks */}
            <div className="task-section">
              <h3>✅ Completed Tasks</h3>
              {completedTasks.length === 0 ? (
                <p className="empty-msg">No completed tasks.</p>
              ) : (
                <div className="task-list">
                  {completedTasks.map((t, i) => {
                    const actualIndex = tasks.findIndex(task => task === t);
                    return (
                      <TaskCard
                        key={actualIndex}
                        task={t}
                        idx={actualIndex}
                        tasks={tasks}
                        update={update}
                        editIndex={editIndex}
                        editTask={editTask}
                        handleEdit={handleEdit}
                        handleSave={handleSave}
                        handleCancel={handleCancel}
                        setEditTask={setEditTask}
                        theme={theme}
                      />
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

// ✅ Extracted TaskCard for reuse
const TaskCard = ({
  task,
  idx,
  tasks,
  update,
  editIndex,
  editTask,
  handleEdit,
  handleSave,
  handleCancel,
  setEditTask,
  theme
}) => (
  <div
    className={`task-card ${theme} ${task.completed ? "completed" : ""}`}
  >
    <div className="task-header">
      <h3>{task.taskName}</h3>
      <span className={`status-badge ${task.completed ? "completed" : "pending"}`}>
        {task.completed ? "Completed" : "Pending"}
      </span>
    </div>

    <div className="task-info">
      <p>{task.description}</p>
      <small>
        📂 {task.category} | ⚡ {task.priority} | 📅 {task.date}
      </small>
    </div>

    <div className="task-actions">
      <button
        className="complete-btn"
        onClick={() =>
          update(
            tasks.map((t, i) =>
              i === idx ? { ...t, completed: !t.completed } : t
            )
          )
        }
      >
        {task.completed ? "↩️ Undo" : "✅ Complete"}
      </button>

      <button
        className="edit-btn"
        onClick={() => handleEdit(idx)}
      >
        ✏️ Edit
      </button>

      <button
        className="delete-btn"
        onClick={() => update(tasks.filter((_, i) => i !== idx))}
      >
        🗑️ Delete
      </button>
    </div>

    {editIndex === idx && (
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
);

export default ManageTasks;
