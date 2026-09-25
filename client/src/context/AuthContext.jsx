import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campusos_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('campusos_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify user token on launch
  useEffect(() => {
    const verifyUser = async () => {
      const savedToken = localStorage.getItem('campusos_token');
      if (savedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.data?.success) {
            setUser(res.data.user);
            localStorage.setItem('campusos_user', JSON.stringify(res.data.user));
          } else {
            logout();
          }
        } catch (err) {
          if (err.response?.status === 401) {
            logout();
          } else {
            console.warn('Session verification fallback to stored user:', err.message);
          }
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const saveAuthData = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('campusos_token', newToken);
    localStorage.setItem('campusos_user', JSON.stringify(newUser));
  };

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      if (res.data?.success) {
        saveAuthData(res.data.token, res.data.user);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Login error',
      };
    }
  };

  const register = async (formData) => {
    try {
      const res = await authAPI.register(formData);
      if (res.data?.success) {
        saveAuthData(res.data.token, res.data.user);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.data?.message || 'Registration failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Registration error',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('campusos_token');
    localStorage.removeItem('campusos_user');
  };

  // Demo Student Shortcut
  const loginAsStudent = async () => {
    return await login('alex@campusos.edu', 'Student@123');
  };

  // Demo Admin Shortcut
  const loginAsAdmin = async () => {
    return await login('admin@campusos.edu', 'Admin@123');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    loginAsStudent,
    loginAsAdmin,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
