// src/Dashboard.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e1e1e, #3a3a3a);
  color: white;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const Message = styled.h2`
  font-size: 1.5rem;
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 15px 30px;
  font-size: 1.2rem;
  cursor: pointer;
  margin: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Check if the user is authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin"); // Redirect to SignIn if no token is found
    }
  }, [navigate]);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please sign in again.");
        navigate("/signin");
        return;
      }

      const { data } = await axios.get("http://localhost:5000/dashboard", {
        headers: { Authorization: token },
      });
      setMessage(data.message);
    } catch (err) {
      alert(err.response?.data?.error || "An error occurred");
    }
  };

  const handleSignout = () => {
    localStorage.removeItem("token"); // Clear the token
    navigate("/signin"); // Redirect to SignIn page
  };

  return (
    <Container>
      <Title>Dashboard</Title>
      <Button onClick={fetchDashboard}>Fetch Dashboard</Button>
      <Button onClick={handleSignout}>Sign Out</Button>
      {message && <Message>{message}</Message>}
    </Container>
  );
};

export default Dashboard;
