import { useEffect, useMemo, useState } from "react";
import { apiClient, unwrap } from "../lib/apiClient";
import { AuthContext } from "./auth-context";

const TOKEN_KEY = "admin-token";
const USER_KEY = "admin-user";

const sanitizeUserForStorage = (user) => {
  if (!user) return null;
  const avatar = typeof user.avatar === "string" ? user.avatar.trim() : "";

  return {
    ...user,
    // Keep local session storage lightweight; large data URLs should come from the API/DB.
    avatar: avatar.startsWith("data:") ? "" : avatar,
  };
};

const persistStoredUser = (user) => {
  if (!user) {
    localStorage.removeItem(USER_KEY);
    return;
  }

  try {
    localStorage.setItem(USER_KEY, JSON.stringify(sanitizeUserForStorage(user)));
  } catch {
    // If storage quota is exceeded, keep auth alive via token and drop cached user snapshot.
    localStorage.removeItem(USER_KEY);
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiClient.get("/auth/me").then(unwrap);
        setUser(data.user);
        persistStoredUser(data.user);
      } catch (error) {
        // Keep session on transient failures; clear only when token is truly invalid.
        if (error?.response?.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, [token]);

  const login = async (email, password) => {
    const data = await apiClient.post("/auth/login", { email, password }).then(unwrap);
    localStorage.setItem(TOKEN_KEY, data.token);
    persistStoredUser(data.user);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const setUserData = (nextUser) => {
    setUser(nextUser);
    persistStoredUser(nextUser);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      login,
      logout,
      setUserData,
    }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
