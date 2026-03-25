import { useState } from "react";

const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const [id, setId] = useState(localStorage.getItem("id") || null);

  const saveAuthData = (newToken: string, newUser: string, newId: string) => {
    setToken(newToken);
    setUser(newUser);
    setId(newId);

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", newUser);
    localStorage.setItem("id", newId);
  };

  const clearAuthData = () => {
    setToken(null);
    setUser(null);
    setId(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("id");
  };

  return { token, user, id, saveAuthData, clearAuthData };
};

export default useAuth;