// src/SignUp.js
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { login } from "../Redux/authSlice"; // Import the login action

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

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch(); // Initialize useDispatch

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/auth/signup", {
        username,
        password,
      });
      alert("User signed up successfully");

      // Optional: Automatically log the user in after signup
      localStorage.setItem("token", data.token); // Assuming an immediate token is provided
      dispatch(login()); // Dispatch Redux login action
    } catch (err) {
      alert(err.response?.data?.error || "An error occurred during sign up");
    }
  };

  return (
    <Container>
      <Title>Sign Up for BLACKBOXAI</Title>
      <form onSubmit={handleSignup}>
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
        <Button type="submit">Sign Up</Button>
      </form>
    </Container>
  );
};

export default SignUp;
