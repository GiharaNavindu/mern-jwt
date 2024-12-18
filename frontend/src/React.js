import axios from "axios";
import React, { useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

const API_URL = "http://localhost:5000";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/signup`, { username, password });
      alert("User signed up successfully");
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/signin`, { username, password });
      localStorage.setItem("token", data.token);
      setToken(data.token);
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  if (token) return <Navigate to="/dashboard" />;

  return (
    <form onSubmit={handleSignin}>
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign In</button>
    </form>
  );
};

const Dashboard = () => {
  const [message, setMessage] = useState("");

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/dashboard`, {
        headers: { Authorization: token },
      });
      setMessage(data.message);
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <div>
      <button onClick={fetchDashboard}>Fetch Dashboard</button>
      {message && <h1>{message}</h1>}
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </Router>
);

export default App;
