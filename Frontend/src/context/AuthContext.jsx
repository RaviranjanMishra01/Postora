import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await authApi.getMe();
      if (res.data && res.data.user) {
        setUser(res.data.user);
      }
    } catch (err) {
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
    if (res.data && res.data.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const adminLogin = async (credentials) => {
    const res = await authApi.adminLogin(credentials);
    if (res.data && res.data.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const superAdminLogin = async (credentials) => {
    const res = await authApi.superAdminLogin(credentials);
    if (res.data && res.data.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.data && res.data.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const googleLogin = async (googleData) => {
    const res = await authApi.googleAuth(googleData);
    if (res.data && res.data.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error(err);
    } finally {
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
