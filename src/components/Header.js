import React from "react";
import { useApp } from "../context/AppContext";

export default function Header() {
  const { user, setPage, page, favorites, myGroups } = useApp();

  return (
    <header style={styles.header}>
      <div style={styles.logo} onClick={() => setPage("home")}>
        <span style={styles.logoIcon}>🎬</span>
        <span style={styles.logoText}>CineMatch</span>
      </div>

      <nav style={styles.nav}>
        <button
          style={{ ...styles.navBtn, ...(page === "home" ? styles.navBtnActive : {}) }}
          onClick={() => setPage("home")}
        >
          Подборка
        </button>
        <button
          style={{ ...styles.navBtn, ...(page === "favorites" ? styles.navBtnActive : {}) }}
          onClick={() => setPage("favorites")}
        >
          Избранное
          {favorites.length > 0 && (
            <span style={styles.badge}>{favorites.length}</span>
          )}
        </button>
        <button
          style={{ ...styles.navBtn, ...(page === "groups" ? styles.navBtnActive : {}) }}
          onClick={() => setPage("groups")}
        >
          <span style={{ fontSize: 14 }}>👥</span>
          Группы
          {myGroups.length > 0 && (
            <span style={styles.badge}>{myGroups.length}</span>
          )}
        </button>
      </nav>

      <div style={styles.userZone}>
        <button style={styles.profileBtn} onClick={() => setPage("profile")}>
          <div style={styles.avatar}>
            {(user?.displayName || user?.name || "?")[0].toUpperCase()}
          </div>
          <span style={styles.userName}>{user?.displayName || user?.name}</span>
          <span style={styles.chevron}>›</span>
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    height: 68,
    background: "rgba(10,10,15,0.85)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(201,162,39,0.12)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    fontFamily: "'DM Sans', sans-serif",
  },
  logo: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  logoIcon: { fontSize: 22 },
  logoText: { fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#c9a227" },
  nav: { display: "flex", gap: 4 },
  navBtn: {
    background: "transparent", border: "none", color: "rgba(255,255,255,0.45)",
    cursor: "pointer", padding: "8px 18px", borderRadius: 8, fontSize: 14,
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500, transition: "all 0.2s",
    display: "flex", alignItems: "center", gap: 8, position: "relative",
  },
  navBtnActive: { color: "#c9a227", background: "rgba(201,162,39,0.1)" },
  badge: {
    background: "#c9a227", color: "#0a0a0f", borderRadius: 20,
    fontSize: 11, fontWeight: 700, padding: "1px 7px", lineHeight: "18px",
  },
  userZone: { display: "flex", alignItems: "center" },
  profileBtn: {
    display: "flex", alignItems: "center", gap: 10,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 40, padding: "6px 14px 6px 6px", cursor: "pointer",
    transition: "all 0.2s", color: "#fff", fontFamily: "'DM Sans', sans-serif",
  },
  avatar: {
    width: 32, height: 32, borderRadius: "50%",
    background: "linear-gradient(135deg, #c9a227, #e8c547)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 700, color: "#0a0a0f",
  },
  userName: {
    fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.8)",
    maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  chevron: { color: "rgba(255,255,255,0.3)", fontSize: 18, lineHeight: 1 },
};
