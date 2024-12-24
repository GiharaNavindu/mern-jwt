import axios from "axios";
import React, { useEffect, useState } from "react";
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
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }

    // Setup Axios default authorization header
    axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

    // Axios interceptor for refreshing token
    const requestInterceptor = axios.interceptors.request.use((request) => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!request.headers["Authorization"] && refreshToken) {
        request.headers["Authorization"] = `Bearer ${refreshToken}`;
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
            return axios(originalRequest);
          } catch (refreshError) {
            console.log("Refresh token failed:", refreshError);
            // Maybe redirect to login or handle token expiry
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on component unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/auth/signin", {
        username,
        password,
      });
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken); // Store refresh token
      dispatch(login());
      setToken(data.accessToken);
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
