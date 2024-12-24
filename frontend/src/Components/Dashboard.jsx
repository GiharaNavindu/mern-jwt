// src/Dashboard.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { logout } from "../Redux/authSlice";

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
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }

    // Setup Axios interceptor for token refresh
    const requestInterceptor = axios.interceptors.request.use((request) => {
      const accessToken = localStorage.getItem("token");
      if (accessToken) {
        request.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return request;
    });

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const refreshToken = localStorage.getItem("refreshToken");
          try {
            const { data } = await axios.post(
              "http://localhost:5000/auth/refresh",
              {
                token: refreshToken,
              }
            );
            localStorage.setItem("token", data.token);
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${data.token}`;

            // Retry the original request with the new token
            return axios(originalRequest);
          } catch (refreshError) {
            console.log("Refresh token failed:", refreshError);
            dispatch(logout()); // Logout if refresh fails
            navigate("/signin");
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [dispatch, isAuthenticated, navigate]);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/dashboard");
      setMessage(data.message);
    } catch (err) {
      alert(err.response?.data?.error || "An error occurred");
    }
  };

  const handleSignout = () => {
    dispatch(logout());
    navigate("/signin");
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
