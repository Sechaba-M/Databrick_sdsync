import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AdminHomePage from "./pages/AdminHomePage";
import DatasheetPage from "./pages/DatasheetPage";
import AddUserPage from "./pages/AddUserPage";
import MedicalDataPage from "./pages/MedicalDataPage";
import DashboardInfoPage from "./pages/DashboardInfoPage";
import ResetPage from "./pages/ResetPasswordPage";
import UserHomePage from "./pages/UserHome";
import ProfilePage from "./pages/ProfilePage";

function getInitialSession() {
  try {
    const stored = localStorage.getItem("session");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function AppInner() {
  const [session, setSession] = useState(getInitialSession);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = !!session && session.user?.role === "admin";

  // Sync session across tabs
  useEffect(() => {
    function handleStorage(e) {
      if (e.key === "session") {
        try {
          setSession(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setSession(null);
        }
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // login handler force change password
  function handleLogin(newSession) {
    setSession(newSession);
    localStorage.setItem("session", JSON.stringify(newSession));

    // force password change for first-time users
    if (newSession.mustChangePassword) {
    navigate("/reset", { replace: true });
    return;
    }


    // Normal routing
    if (newSession.user?.role === "admin") {
      navigate("/chemicaldashboard", { replace: true });
    } else {
      navigate("/user", { replace: true });
    }
  }

  function handleLogout() {
    localStorage.removeItem("session");
    setSession(null);
    navigate("/", { replace: true });
  }

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/"
        element={
          session ? (
            <Navigate
              to={
               session.mustChangePassword
              ? "/reset"
              : isAdmin
              ? "/chemicaldashboard"
              : "/user"
              }
              replace
            />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        }
      />

      {/* Admin + shared routes */}
      <Route
        path="/chemicaldashboard"
        element={
          <PrivateRoute session={session}>
            <AdminHomePage onLogout={handleLogout} isAdmin={isAdmin} />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute session={session}>
            <DashboardInfoPage onLogout={handleLogout} isAdmin={isAdmin} />
          </PrivateRoute>
        }
      />

      <Route
        path="/medicaldata"
        element={
          <PrivateRoute session={session}>
            <MedicalDataPage onLogout={handleLogout} isAdmin={isAdmin} />
          </PrivateRoute>
        }
      />

      <Route
        path="/sds"
        element={
          <PrivateRoute session={session}>
            <DatasheetPage onLogout={handleLogout} isAdmin={isAdmin} />
          </PrivateRoute>
        }
      />

      <Route
        path="/sds/:id"
        element={
          <PrivateRoute session={session}>
            <DatasheetPage onLogout={handleLogout} isAdmin={isAdmin} />
          </PrivateRoute>
        }
      />

      {/* User home */}
      <Route
        path="/user"
        element={
          <PrivateRoute session={session}>
            <UserHomePage onLogout={handleLogout} />
          </PrivateRoute>
        }
      />

      {/* Admin-only */}
      <Route
        path="/adduser"
        element={
          <AdminRoute session={session}>
            <AddUserPage onLogout={handleLogout} isAdmin={isAdmin} />
          </AdminRoute>
        }
      />

      {/* Profile */}
      <Route
        path="/profile"
        element={
          <PrivateRoute session={session}>
            <ProfilePage onLogout={handleLogout} isAdmin={isAdmin} />
          </PrivateRoute>
        }
      />

      {/* Forced password reset */}
      <Route
        path="/reset"
        element={
          <PrivateRoute session={session}>
            <ResetPage />
          </PrivateRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/**
 *Blocks access unless logged in
 *Forces password change if required
 */
function PrivateRoute({ session, children }) {
  const location = useLocation();

  if (!session) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (
    session.mustChangePassword &&
    location.pathname !== "/reset"
  ) {
  return <Navigate to="/reset" replace />;
  }


  return children;
}

/**
 * Admin-only routes
 */
function AdminRoute({ session, children }) {
  const location = useLocation();

  if (!session) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (session.user?.role !== "admin") {
    return <Navigate to="/user" replace state={{ from: location }} />;
  }

  return children;
}

export default function App() {
  return <AppInner />;
}

