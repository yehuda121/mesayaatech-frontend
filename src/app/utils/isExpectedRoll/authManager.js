import { jwtDecode } from "jwt-decode";

const storage = typeof window !== "undefined" ? sessionStorage : null;

export function setToken(token) {
  if (storage) {
    storage.setItem("idToken", token);
  }
}

export function getToken() {
  return storage?.getItem("idToken") || null;
}

export function clearToken() {
  storage?.removeItem("idToken");
}

export function getUserRole() {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    const exp = decoded.exp * 1000;
    if (Date.now() > exp) {
      clearToken();
      return null;
    }
    return decoded["custom:role"];
  } catch {
    clearToken();
    return null;
  }
}
