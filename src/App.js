import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import GroupsPage from "./pages/GroupsPage";

function Router() {
  const { page } = useApp();
  switch (page) {
    case "auth":      return <AuthPage />;
    case "home":      return <HomePage />;
    case "favorites": return <FavoritesPage />;
    case "profile":   return <ProfilePage />;
    case "groups":    return <GroupsPage />;
    default:          return <AuthPage />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; }
        input:focus { border-color: rgba(201,162,39,0.4) !important; box-shadow: 0 0 0 3px rgba(201,162,39,0.08); }
        button:hover { opacity: 0.88; }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background: rgba(201,162,39,0.25); border-radius: 3px; }
      `}</style>
      <Router />
    </AppProvider>
  );
}
