import React, { createContext, useContext, useState } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  const login = async (username, password) => {
    const res = await authAPI.login({ username, password });
    localStorage.setItem('access_token', res.data.access);
    setToken(res.data.access);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}
// 
export const useAuth = () => useContext(AuthContext);
