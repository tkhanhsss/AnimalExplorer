import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { LogOut, User, Clock, ChevronDown, Menu, X, Compass } from "lucide-react";
import toast from "react-hot-toast";
import logo from "../assets/AnimalExplorer_NavBarLogo.png";

const NavBar = () => {
  const { user, logout } = useApp();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout();
    toast.success("Đã đăng xuất thành công!");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg shadow-green-900/5"
            : "bg-white/90 backdrop-blur-sm shadow-md"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition group">
            <img src={logo} alt="Animal Explorer Logo" className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-200" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/"
              className={`relative px-5 py-2.5 text-base font-medium rounded-xl transition-all duration-200 ${
                isActive("/")
                  ? "text-green-700 bg-green-50"
                  : "text-gray-600 hover:text-green-700 hover:bg-green-50"
              }`}
            >
              Trang chủ
              {isActive("/") && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-600 rounded-full" />
              )}
            </Link>

            <Link
              to="/identify"
              className={`relative px-5 py-2.5 text-base font-medium rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                isActive("/identify")
                  ? "text-green-700 bg-green-50"
                  : "text-gray-600 hover:text-green-700 hover:bg-green-50"
              }`}
            >
              <Compass className="w-4 h-4" />
              Nhận diện ảnh
              {isActive("/identify") && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-600 rounded-full" />
              )}
            </Link>

            {/* Auth area */}
            {user ? (
              <div className="relative ml-2" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold uppercase">{user.username[0]}</span>
                  </div>
                  <span className="text-sm font-semibold text-green-800 max-w-[80px] truncate">{user.username}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-green-600 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-fade-in origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-xs text-gray-400 mb-0.5">Đang đăng nhập</p>
                      <p className="text-sm font-bold text-gray-800 truncate">@{user.username}</p>
                    </div>

                    <Link
                      to="/history"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                      <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-green-600" />
                      </div>
                      Lịch sử nhận diện
                    </Link>

                    <div className="border-t border-gray-50 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center">
                          <LogOut className="w-4 h-4 text-red-500" />
                        </div>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2 text-base font-bold text-white bg-green-600 hover:bg-green-700 px-6 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                Đăng nhập
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              <Link to="/" className={`px-4 py-3 rounded-xl text-sm font-medium transition ${isActive("/") ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-50"}`}>Trang chủ</Link>
              <Link to="/identify" className={`px-4 py-3 rounded-xl text-sm font-medium transition ${isActive("/identify") ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-50"}`}>Nhận diện ảnh</Link>
              {user ? (
                <>
                  <Link to="/history" className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition">Lịch sử nhận diện</Link>
                  <button onClick={handleLogout} className="text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition">Đăng xuất</button>
                </>
              ) : (
                <Link to="/login" className="px-4 py-3 rounded-xl text-sm font-bold text-white bg-green-600 text-center">Đăng nhập / Đăng ký</Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default NavBar;
