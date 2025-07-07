import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ManageTasks.css";
import { useTheme } from "../../context/ThemeContext";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editTask, setEditTask] = useState({});
  const { theme } = useTheme();

  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  useEffect(() => {
    let stored = JSON.parse(localStorage.getItem("tasks")) || [];
    // ✅ Ensure every task has status
    stored = stored.map(task => ({
      ...task,
      status: task.status || "To Do"
    }));
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
      i === editIndex ? { ...editTask, status: editTask.status || "To Do" } : t
    );
    update(updated);
    setEditIndex(null);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditTask({});
  };

  // ✅ Filters
  const filteredTasks = tasks.filter(task => {
    const matchSearch =
      (task.taskName || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(searchText.toLowerCase());
    const matchCategory = categoryFilter ? task.category === categoryFilter : true;
    const matchPriority = priorityFilter ? task.priority === priorityFilter : true;
    return matchSearch && matchCategory && matchPriority;
  });

  // ✅ Kanban Columns
  const todoTasks = filteredTasks.filter(task => task.status === "To Do");
  const inProgressTasks = filteredTasks.filter(task => task.status === "In Progress");
  const completedTasks = filteredTasks.filter(task => task.status === "Completed");

  return (
    <div className={`manage-task-wrapper ${theme}`}>
      <div className="back-button-wrapper">
        <Link to="/Dashboard" className="back-button">
          ⬅ Back to Dashboard
        </Link>
      </div>

      <div className={`manage-task-container ${theme}`}>
        <h2>🗂️ Manage Tasks (Kanban Board)</h2>

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
          <div className="kanban-board">
            <KanbanColumn title="📝 To Do" tasks={todoTasks} allTasks={tasks} update={update} {...taskCardProps()} />
            <KanbanColumn title="🚧 In Progress" tasks={inProgressTasks} allTasks={tasks} update={update} {...taskCardProps()} />
            <KanbanColumn title="✅ Completed" tasks={completedTasks} allTasks={tasks} update={update} {...taskCardProps()} />
          </div>
        )}
      </div>
    </div>
  );

  function taskCardProps() {
    return {
      editIndex,
      editTask,
      handleEdit,
      handleSave,
      handleCancel,
      setEditTask,
      theme
    };
  }
};

const KanbanColumn = ({ title, tasks, allTasks, update, ...props }) => (
  <div className="kanban-column">
    <h3>{title}</h3>
    {tasks.length === 0 ? (
      <p className="empty-msg">No tasks</p>
    ) : (
      tasks.map((t) => {
        const actualIndex = allTasks.findIndex(task => task === t);
        return (
          <TaskCard
            key={actualIndex}
            task={t}
            idx={actualIndex}
            tasks={allTasks}
            update={update}
            {...props}
          />
        );
      })
    )}
  </div>
);

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
  <div className={`task-card ${theme} ${task.status === "Completed" ? "completed" : ""}`}>
    <div className="task-header">
      <h4>{task.taskName}</h4>
      <span className={`status-badge ${task.status.toLowerCase().replace(" ", "-")}`}>
        {task.status}
      </span>
    </div>

    <div className="task-info">
      <p>{task.description}</p>
      <small>
        📂 {task.category} | ⚡ {task.priority} | 📅 {task.date}
      </small>
    </div>

    <div className="task-actions">
      {task.status !== "Completed" && (
        <button
          className="complete-btn"
          onClick={() =>
            update(
              tasks.map((t, i) =>
                i === idx ? { ...t, status: "Completed" } : t
              )
            )
          }
        >
          ✅ Mark Complete
        </button>
      )}
      <button className="edit-btn" onClick={() => handleEdit(idx)}>
        ✏️ Edit
      </button>
      <button className="delete-btn" onClick={() => update(tasks.filter((_, i) => i !== idx))}>
        🗑️ Delete
      </button>
    </div>

    {editIndex === idx && (
      <div className="edit-form">
        <input
          type="text"
          value={editTask.taskName}
          onChange={(e) => setEditTask({ ...editTask, taskName: e.target.value })}
          placeholder="Task Name"
        />
        <textarea
          value={editTask.description}
          onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
          placeholder="Description"
        ></textarea>
        <input
          type="text"
          value={editTask.category}
          onChange={(e) => setEditTask({ ...editTask, category: e.target.value })}
          placeholder="Category"
        />
        <input
          type="text"
          value={editTask.priority}
          onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}
          placeholder="Priority"
        />
        <input
          type="date"
          value={editTask.date}
          onChange={(e) => setEditTask({ ...editTask, date: e.target.value })}
        />

        <div className="edit-actions">
          <button className="save-btn" onClick={handleSave}>💾 Save</button>
          <button className="cancel-btn" onClick={handleCancel}>❌ Cancel</button>
        </div>
      </div>
    )}
  </div>
);

export default ManageTasks;
