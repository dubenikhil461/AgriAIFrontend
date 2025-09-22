import axios from "axios";

const Ax = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ use import.meta.env in Vite
  headers: {
    "Content-Type": "application/json",
  },
});

export default Ax;
