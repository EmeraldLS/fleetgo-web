import axios from "axios";

const user: User = JSON.parse(localStorage.getItem("user")!);

const api = axios.create({
  baseURL: "http://localhost:2323/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.token}`,
  },
});

export default api;
