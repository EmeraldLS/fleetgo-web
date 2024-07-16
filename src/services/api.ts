import axios from "axios";
import { jwtDecode } from "jwt-decode";

const getUser = () => {
  const user: User = JSON.parse(localStorage.getItem("user")!);
  return user;
};

const api = axios.create({
  baseURL: "http://localhost:2323/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getUser()?.token}`,
  },
});

const isTokenExpired = () => {
  const decoded = jwtDecode(getUser().token);
  const currentTime = Date.now() / 1000;

  return decoded.exp! < currentTime;
};

const refreshToken = async () => {
  try {
    const response = await axios.post("http://localhost:2323/api/refresh", {
      refresh_token: getUser().refresh_token,
    });

    const data = await response.data;
    console.log(data);

    const newUser = {
      ...getUser(),
      token: response.data.DATA.token,
      refresh_token: response.data.DATA.refresh_token,
    };

    localStorage.setItem("user", JSON.stringify(newUser));
    return response.data.DATA.token;
  } catch (err) {
    console.error("Failed to refresh token", err);
    throw err;
  }
};

api.interceptors.request.use(
  async (config) => {
    if (isTokenExpired()) {
      const newToken = await refreshToken();
      if (config.headers) {
        config.headers.Authorization = `Bearer ${newToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("user");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;
