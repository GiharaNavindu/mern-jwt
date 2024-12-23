// src/LandingPage.js
import React from "react";
import { useNavigate } from "react-router-dom"; // Change this import
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
  font-size: 3rem;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 40px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 15px 30px;
  font-size: 1.2rem;
  margin: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const LandingPage = () => {
  const navigate = useNavigate(); // Change this line

  const handleLogin = () => {
    navigate("/signin"); // Change this line
  };

  const handleSignUp = () => {
    navigate("/signup"); // Change this line
  };

  return (
    <Container>
      <Title>Welcome to BLACKBOXAI</Title>
      <Subtitle>Your journey to AI excellence starts here.</Subtitle>
      <Button onClick={handleLogin}>Sign In</Button>
      <Button onClick={handleSignUp}>Sign Up</Button>
    </Container>
  );
};

export default LandingPage;
