import React, { useState, useRef, useEffect } from "react";
import { Search, Settings, User, Beaker, ChevronDown, LogOut, UserPlus, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

/**
 * Enhanced top navigation bar for SDSYNC.
 *
 * Props:
 *  - onSearchSubmit: (text) => void
 *  - onAddUser: () => void
 *  - onLogout: () => void
 *  - isAdmin: boolean  //controls whether "Add User" shows in dropdown
 */
export default function SdsyncTopBar({
  onSearchSubmit,
  onAddUser,
  onLogout,
  isAdmin = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setShowMobileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  function handleSearchSubmit() {
    if (!searchValue.trim()) return;
    if (onSearchSubmit) {
      onSearchSubmit(searchValue.trim());
    }
    setShowSearch(false);
  }

  function handleSearchKeyPress(e) {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  }

  function handleAddUser() {
    setShowUserMenu(false);
    setShowMobileMenu(false);
    if (onAddUser) onAddUser();
    navigate("/adduser");
  }

  function handleLogout() {
    setShowUserMenu(false);
    setShowMobileMenu(false);
    if (onLogout) onLogout();
  }

  // Determine active tab from URL
  const getActiveTabId = () => {
    const path = location.pathname;

    if (
      path.startsWith("/chemicaldashboard") ||
      path.startsWith("/userchemicaldashboard") ||
      path.startsWith("/sds")
    ) {
      return "database";
    }
    if (path.startsWith("/medicaldata")) {
      return "surveillance";
    }
    if (path.startsWith("/dashboard")) {
      return "dashboard";
    }

    return "database";
  };

  const activeTab = getActiveTabId();

  // Dynamic database link based on role
  const databaseLink = isAdmin
    ? "/chemicaldashboard"
    : "/userchemicaldashboard";

  const tabs = [
    { id: "database", label: "Database", link: databaseLink },
    { id: "surveillance", label: "Monitoring", link: "/medicaldata" },
    { id: "dashboard", label: "Statistics", link: "/dashboard" },
  ];

  return (
    <header className="w-full bg-gradient-to-r from-[#002855] via-[#003E77] to-[#004B8D] text-white shadow-2xl sticky top-0 z-50 border-b border-white/10">
      {/* Top row: logo + icons */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 sm:py-4">
        {/* Left: brand / app name */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group flex-shrink-0">
              <Beaker className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-lg group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-50 to-white bg-clip-text text-transparent drop-shadow-md truncate">
                SDSYNC
              </span>
              <span className="hidden md:block text-xs text-blue-100/90 -mt-0.5 font-medium tracking-wide truncate">
                Chemical Management System
              </span>
            </div>
          </div>
        </div>

        {/* Right: search, settings, user, mobile menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search wrapper - Desktop only */}
          <div className="hidden md:flex items-center" ref={searchRef}>
            <div className="flex items-center gap-2 transition-all duration-300">
              <div
                className={`flex items-center bg-white/15 backdrop-blur-md rounded-xl overflow-hidden border border-white/25 transition-all duration-300 shadow-lg hover:shadow-xl ${
                  showSearch ? "w-56 lg:w-72" : "w-11"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2.5 hover:bg-white/20 transition-all duration-200 rounded-xl group"
                  aria-label="Toggle search"
                >
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                </button>
                {showSearch && (
                  <input
                    aria-label="Desktop search input"
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    placeholder="Search chemicals..."
                    autoFocus
                    className="flex-1 bg-transparent placeholder-blue-100/70 text-white focus:outline-none px-3 py-2.5 text-sm font-medium"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Mobile search icon */}
          <button
            type="button"
            onClick={() => {
              setShowSearch(!showSearch);
              setShowMobileMenu(false);
            }}
            className="md:hidden p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-white/20 transition-all duration-200 shadow-lg group"
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>

          {/* Settings icon - Hidden on mobile, shown on tablet+ */}
          <Link to="/profile" className="hidden sm:block">
            <button
              type="button"
              className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-white/20 transition-all duration-200 shadow-lg hover:shadow-xl group"
              aria-label="Settings"
              title="Profile & Settings"
            >
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </Link>

          {/* User icon + dropdown - Desktop only */}
          <div className="hidden md:block relative z-50" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowSearch(false);
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-white/20 transition-all duration-200 shadow-lg hover:shadow-xl group"
              aria-label="User menu"
              aria-expanded={showUserMenu}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/25 to-white/10 border-2 border-white/40 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                <User className="w-4 h-4" />
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  showUserMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white text-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                {isAdmin && (
                  <>
                    <button
                      type="button"
                      onClick={handleAddUser}
                      className="w-full text-left px-5 py-3.5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 transition-all duration-200 flex items-center gap-3.5 text-sm font-semibold text-gray-700 hover:text-[#003E77] group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                        <UserPlus className="w-4.5 h-4.5 text-[#003E77]" />
                      </div>
                      <span>Add User</span>
                    </button>
                    <div className="border-t border-gray-100" />
                  </>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-3.5 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100/50 transition-all duration-200 flex items-center gap-3.5 text-sm font-semibold text-gray-700 hover:text-red-600 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                    <LogOut className="w-4.5 h-4.5 text-red-600" />
                  </div>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => {
              setShowMobileMenu(!showMobileMenu);
              setShowSearch(false);
            }}
            className="md:hidden p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-white/20 transition-all duration-200 shadow-lg group"
            aria-label="Toggle mobile menu"
          >
            {showMobileMenu ? (
              <X className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            ) : (
              <Menu className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom row: section nav - Desktop/Tablet */}
      <nav className="hidden md:block bg-black/15 backdrop-blur-md border-t border-white/10">
        <ul className="flex text-sm px-4 sm:px-6 lg:px-10 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <li key={tab.id} className="flex-shrink-0">
              <button
                type="button"
                onClick={() => navigate(tab.link)}
                className={`relative px-4 sm:px-6 lg:px-7 py-3 sm:py-4 font-semibold transition-all duration-300 whitespace-nowrap group text-xs sm:text-sm ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-blue-100/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="relative z-10">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/80 via-white to-white/80 rounded-t-full shadow-lg animate-in slide-in-from-bottom-1 duration-300" />
                )}
                {activeTab !== tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/0 group-hover:bg-white/30 rounded-t-full transition-all duration-300" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile search bar */}
      {showSearch && (
        <div className="md:hidden px-4 pb-4 bg-gradient-to-r from-[#002855] via-[#003E77] to-[#004B8D] border-t border-white/10">
          <div className="flex gap-2 sm:gap-3 mt-3">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              placeholder="Search chemicals..."
              autoFocus
              className="flex-1 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-lg font-medium placeholder-gray-400"
            />
            <button
              type="button"
              onClick={handleSearchSubmit}
              className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white text-[#003E77] text-sm font-bold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu dropdown */}
      {showMobileMenu && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-white text-gray-800 border-t border-gray-200 shadow-2xl animate-in slide-in-from-top-2 duration-200"
        >
          {/* Navigation tabs */}
          <div className="border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  navigate(tab.link);
                  setShowMobileMenu(false);
                }}
                className={`w-full text-left px-5 py-4 font-semibold transition-all duration-200 flex items-center justify-between ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-[#003E77] border-l-4 border-[#003E77]"
                    : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
                }`}
              >
                <span className="text-sm sm:text-base">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="w-2 h-2 rounded-full bg-[#003E77]" />
                )}
              </button>
            ))}
          </div>

          {/* User actions */}
          <div className="py-2">
            <Link
              to="/profile"
              onClick={() => setShowMobileMenu(false)}
              className="w-full text-left px-5 py-3.5 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 transition-all duration-200 flex items-center gap-3.5 text-sm font-semibold text-gray-700 hover:text-[#003E77] group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                <Settings className="w-4.5 h-4.5 text-gray-600" />
              </div>
              <span>Profile & Settings</span>
            </Link>

            {isAdmin && (
              <button
                type="button"
                onClick={handleAddUser}
                className="w-full text-left px-5 py-3.5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 transition-all duration-200 flex items-center gap-3.5 text-sm font-semibold text-gray-700 hover:text-[#003E77] group"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                  <UserPlus className="w-4.5 h-4.5 text-[#003E77]" />
                </div>
                <span>Add User</span>
              </button>
            )}

            <div className="border-t border-gray-100 my-2" />

            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-5 py-3.5 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100/50 transition-all duration-200 flex items-center gap-3.5 text-sm font-semibold text-gray-700 hover:text-red-600 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                <LogOut className="w-4.5 h-4.5 text-red-600" />
              </div>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}