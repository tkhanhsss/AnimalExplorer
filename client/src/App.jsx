import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useApp } from "./context/AppContext";

import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Identify from "./pages/Identify";
import Login from "./pages/Login";
import History from "./pages/History";

// Route yêu cầu đăng nhập
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useApp();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Layout có NavBar (hầu hết các trang)
const WithNav = ({ children }) => (
  <>
    <NavBar />
    {children}
  </>
);

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        {/* Trang Login — KHÔNG có NavBar, chiếm full viewport */}
        <Route path="/login" element={<Login />} />

        {/* Các trang có NavBar */}
        <Route path="/" element={<WithNav><Home /></WithNav>} />
        <Route path="/identify" element={<WithNav><Identify /></WithNav>} />
        <Route
          path="/history"
          element={
            <WithNav>
              <ProtectedRoute><History /></ProtectedRoute>
            </WithNav>
          }
        />

        {/* Trang không tồn tại → về Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;