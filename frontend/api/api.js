import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const { data } = await axios.post("http://localhost:5000/auth/refresh-token", {
            refreshToken,
          });

          localStorage.setItem("token", data.accessToken);
          api.defaults.headers.common["Authorization"] = data.accessToken;

          return api(originalRequest); // Retry the original request with the new access token
        } catch (err) {
          console.error("Refresh token invalid");
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/signin"; // Redirect to sign in
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
