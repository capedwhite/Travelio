import { createContext, useContext, useState } from "react";
import api from "../api/axios";
import { useEffect, useRef } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const heartbeatInterval = useRef(null);

  // Heartbeat function to track active users
  const startHeartbeat = () => {
    // Clear any existing interval
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
    }

    // Send initial heartbeat
    api.post("/user/heartbeat").catch(() => {});

    // Send heartbeat every 2 minutes
    heartbeatInterval.current = setInterval(
      () => {
        api.post("/user/heartbeat").catch(() => {});
      },
      2 * 60 * 1000,
    );
  };

  const stopHeartbeat = () => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authtoken");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/user/init")
      .then((res) => {
        setUser(res.data.data);
        startHeartbeat();
      })
      .catch(() => {
        localStorage.removeItem("authtoken");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => stopHeartbeat();
  }, []);

  const login = async (token) => {
    localStorage.setItem("authtoken", token);
    const userinfo = await api.get("/user/init");
    setUser(userinfo.data.data);
    startHeartbeat();
  };

  const logout = () => {
    stopHeartbeat();
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
