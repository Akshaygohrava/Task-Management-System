import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/SignUp";
import Welcome from "./Components/Welcome";
import Dashboard from "./Components/Dashboard/Dashboard";
import AddTask from "./Components/TaskMng/AddTask";
import ManageTasks from "./Components/TaskMng/ManageTasks";
import ProgressTracker from "./Components/TaskMng/ProgressTracker";
import Layout from "./Components/Layout";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-task" element={<AddTask />} />
          <Route path="/manage-tasks" element={<ManageTasks />} />

          <Route path="*" element={<Navigate to="/dashboard" />} />
          <Route path="/track-progress" element={<ProgressTracker />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
