import React, { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../config/settings";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken") || "");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const tokenFromUrl = query.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      localStorage.setItem("authToken", tokenFromUrl);
    }
  }, []);

  useEffect(() => {
  if (token) {
    setLoading(true);
    fetch(`${API_URL}/api/v1/users/current`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCurrentUser({
          ...data,
          github_repositories: data.github_repositories || []
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setCurrentUser(null);
        setToken("");
        localStorage.removeItem("authToken");
        setLoading(false);
      });
  } else {
    setLoading(false);
  }
}, [token]);
  const logout = () => {
    setCurrentUser(null);
    setToken("");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ token, logout, setToken, currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};