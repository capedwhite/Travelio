import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import {jwtDecode} from "jwt-decode";
import { useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authtoken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log(decoded)
        setUser(decoded);
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  const logout = () => {
    console.log("logout function calling")
    try{
    localStorage.removeItem("authtoken");
    setUser(null);
    }
    catch(error){
        console.log(error)
    }
  };

  return (
    <AuthContext.Provider value={{ user,loading,logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);