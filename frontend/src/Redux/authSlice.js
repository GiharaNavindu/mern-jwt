import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: !!localStorage.getItem("token"), // Check if a token exists
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem("token"); // Clear token on logout
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
