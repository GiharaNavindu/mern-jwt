// src/SignIn.js
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { login } from "../Redux/authSlice";

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

const Input = styled.input`
  width: 300px;
  padding: 15px;
  margin: 10px 0;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 15px 30px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const dispatch = useDispatch(); // Initialize useDispatch

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/auth/signin", {
        username,
        password,
      });
      localStorage.setItem("token", data.token);
      dispatch(login()); // Dispatch Redux login action
      setToken(data.token);
    } catch (err) {
      alert(err.response?.data?.error || "An error occurred");
    }
  };

  if (token) return <Navigate to="/dashboard" />;

  return (
    <Container>
      <Title>Sign In to BLACKBOXAI</Title>
      <form onSubmit={handleSignin}>
        <Input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Sign In</Button>
      </form>
    </Container>
  );
};

export default SignIn;
