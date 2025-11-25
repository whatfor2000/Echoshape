import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
  id?: string;
  email?: string;
  name?: string;
  // เพิ่ม field อื่น ๆ ตาม JWT payload
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {

    if (window.location.href.indexOf('#_=_') > 0) {
      window.location.href = window.location.href.replace(/#.*/, '');
    }
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/auth/profile`, { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
