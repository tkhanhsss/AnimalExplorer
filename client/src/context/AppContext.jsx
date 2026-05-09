import { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../services/api";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // thông tin user đăng nhập
  const [loading, setLoading] = useState(true); // đang kiểm tra session

  // Khi load app: kiểm tra xem user đã đăng nhập chưa (cookie còn hạn)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authAPI.getMe();
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook để dùng context dễ hơn
export const useApp = () => useContext(AppContext);
