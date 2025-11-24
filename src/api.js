import axios from "axios";

export const api = axios.create({
  baseURL: "https://todo-nest-api-q5la.onrender.com",
});
