import { createContext, useContext, useState } from "react";
import api from "../api/axios";
import { useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authtoken");

    if (!token) {
      setLoading(false);
      return;
    }

    api.get("/user/init")
      .then(res => {
        setUser(res.data.data);
      })
      .catch(() => {
        localStorage.removeItem("authtoken");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (token) => {
    localStorage.setItem("authtoken", token);
    const userinfo = await api.get("/user/init");
    setUser(userinfo.data.data);
  };

  const logout = () => {
    localStorage.removeItem("authtoken");
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
