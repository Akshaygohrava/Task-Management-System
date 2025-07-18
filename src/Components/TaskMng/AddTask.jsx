import React, { useState } from "react";
import "./AddTask.css";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const AddTask = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState(["Personal", "Work", "Other"]);
  const [showInput, setShowInput] = useState(false);

  
  const today = new Date().toISOString().split("T")[0];

  const resetForm = () => {
    setTaskName("");
    setDescription("");
    setPriority("Medium");
    setCategory("");
    setDate("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const task = {
      taskName,
      description,
      priority,
      category,
      date,
      status: "To Do" 
    };
    const existing = JSON.parse(localStorage.getItem("tasks")) || [];
    localStorage.setItem("tasks", JSON.stringify([...existing, task]));
    alert("Task added successfully!");
    resetForm();
    navigate("/Dashboard"); 
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setCategory(newCategory);
    }
    setNewCategory("");
    setShowInput(false);
  };

  return (
    <div className={`add-task-wrapper ${darkMode ? "dark" : "light"}`}>
      <div className="back-button-wrapper">
        <Link to="/Dashboard" className="back-button">
          ⬅ Back to Dashboard
        </Link>
      </div>

      <div className={`add-task-container ${darkMode ? "dark" : "light"}`}>
        <h2>Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              required
              placeholder="Enter task title"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Enter task description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="row-fields">
            <div className="field-group">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                {["Low", "Medium", "High"].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label>Category *</label>
              {!showInput ? (
                <select
                  value={category}
                  required
                  onChange={(e) =>
                    e.target.value === "__add__"
                      ? setShowInput(true)
                      : setCategory(e.target.value)
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="__add__">➕ Add New</option>
                </select>
              ) : (
                <div className="inline-category-input">
                  <input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category"
                  />
                  <button type="button" onClick={addCategory}>
                    ✔
                  </button>
                  <button type="button" onClick={() => setShowInput(false)}>
                    ✖
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Due Date *</label>
            <input
              type="date"
              required
              min={today}  
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="btn-group">
            <button
              type="button"
              className="submit-btn small-btn cancel-btn"
              onClick={resetForm}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn small-btn">
              Add Task
            </button>
          </div>
        </form>        
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

export default AddTask;
