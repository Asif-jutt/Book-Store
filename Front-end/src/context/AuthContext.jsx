import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const saveUser = useCallback((data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  }, []);

  const signup = async (userData) => {
    const response = await authAPI.signup(userData);
    const { data } = response.data;
    saveUser(data);
    return response.data;
  };

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const { data } = response.data;
    saveUser(data);
    return response.data;
  };

  const googleLogin = async (credential) => {
    const response = await authAPI.googleLogin({ credential });
    const { data } = response.data;
    saveUser(data);
    return response.data;
  };

  const facebookLogin = async (accessToken) => {
    const response = await authAPI.facebookLogin({ accessToken });
    const { data } = response.data;
    saveUser(data);
    return response.data;
  };

  const githubLogin = async (code) => {
    const response = await authAPI.githubLogin({ code });
    const { data } = response.data;
    saveUser(data);
    return response.data;
  };

  const checkEmail = async (email) => {
    const response = await authAPI.checkEmail(email);
    return response.data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Continue logout even if API call fails
    }
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    saveUser(newUser);
  };

  const value = {
    user,
    loading,
    signup,
    login,
    googleLogin,
    facebookLogin,
    githubLogin,
    checkEmail,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
