import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAuthResponse = (res) => {
    const token = res.data?.token || res.token;
    const user = res.data?.user || res.user;
    if (token) {
      localStorage.setItem("token", token);
    }
    if (user) {
      setUser(user);
    }
    return res;
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await authApi.getMe();
      const user = res.data?.user || res.user;
      if (user) {
        setUser(user);
      }
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    return handleAuthResponse(res);
  };

  const adminLogin = async (credentials) => {
    const res = await authApi.adminLogin(credentials);
    return handleAuthResponse(res);
  };

  const superAdminLogin = async (credentials) => {
    const res = await authApi.superAdminLogin(credentials);
    return handleAuthResponse(res);
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    return handleAuthResponse(res);
  };

  const googleLogin = async (googleData) => {
    const res = await authApi.googleAuth(googleData);
    return handleAuthResponse(res);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        adminLogin,
        superAdminLogin,
        register,
        googleLogin,
        logout,
        updateUserState,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
