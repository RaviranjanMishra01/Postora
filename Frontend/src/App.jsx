import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";

const AppContent = () => {
  const location = useLocation();
  const isPrivilegedPath = location.pathname.startsWith("/admin") || location.pathname.startsWith("/super-admin");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
      {!isPrivilegedPath && <Navbar />}
      <main style={{ flexGrow: 1 }}>
        <AppRoutes />
      </main>
      {!isPrivilegedPath && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
