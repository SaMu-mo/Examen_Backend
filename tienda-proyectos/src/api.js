const API = "http://localhost:8080";

export function getToken() {
  return localStorage.getItem("token");
}

export function getRol() {
  return localStorage.getItem("rol");
}

export function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`
  };
}

export default API;
