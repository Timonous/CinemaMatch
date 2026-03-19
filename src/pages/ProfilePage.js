import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import Header from "../components/Header";

export default function ProfilePage() {
  const { user, logout, setPage, favorites } = useApp();
  const [activeSection, setActiveSection] = useState("personal");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={styles.root}>
      <Header />
      <div style={styles.main}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarUser}>
            <div style={styles.bigAvatar}>
              {(user?.displayName || user?.name || "?")[0].toUpperCase()}
            </div>
            <div>
              <div style={styles.sidebarName}>{user?.displayName || user?.name}</div>
              <div style={styles.sidebarRole}>Пользователь</div>
            </div>
          </div>

          <nav style={styles.sidebarNav}>
            <button
              style={{
                ...styles.sideNavItem,
                ...(activeSection === "personal" ? styles.sideNavActive : {}),
              }}
              onClick={() => setActiveSection("personal")}
            >
              <span style={styles.navIcon}>👤</span>
              Персональные данные
            </button>
            <button
              style={{
                ...styles.sideNavItem,
                ...(activeSection === "favorites" ? styles.sideNavActive : {}),
              }}
              onClick={() => { setActiveSection("favorites"); setPage("favorites"); }}
            >
              <span style={styles.navIcon}>♥</span>
              Избранное
              {favorites.length > 0 && (
                <span style={styles.sideNavBadge}>{favorites.length}</span>
              )}
            </button>
            <div style={styles.sideNavDivider} />
            <button
              style={{ ...styles.sideNavItem, ...styles.logoutItem }}
              onClick={logout}
            >
              <span style={styles.navIcon}>→</span>
              Выйти из аккаунта
            </button>
          </nav>
        </aside>

        {/* Content */}
        <div style={styles.content}>
          <div style={styles.contentHeader}>
            <button style={styles.breadcrumb} onClick={() => setPage("home")}>
              ← На главную
            </button>
            <h2 style={styles.sectionTitle}>Персональные данные</h2>
            <p style={styles.sectionSub}>
              Управление информацией профиля
            </p>
          </div>

          <div style={styles.mockBanner}>
            <span style={styles.mockIcon}>⚙️</span>
            <div>
              <strong style={{ color: "#c9a227" }}>Раздел в разработке</strong>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 3 }}>
                Полное управление профилем будет доступно в финальной версии системы
              </div>
            </div>
          </div>

          <div style={styles.formGrid}>
            <FormField label="Отображаемое имя" value={user?.displayName || user?.name} disabled />
            <FormField label="Имя пользователя" value={user?.name} disabled />
            <FormField label="Email" value="user@example.com" disabled />
            <FormField label="Дата регистрации" value="19 марта 2026" disabled />
          </div>

          <div style={styles.statsRow}>
            <StatCard icon="♥" value={favorites.length} label="В избранном" />
            <StatCard icon="🎬" value="12" label="Просмотрено" />
            <StatCard icon="⭐" value="8.4" label="Средний рейтинг" />
          </div>

          <div style={styles.prefsSection}>
            <h3 style={styles.prefsTitle}>Жанровые предпочтения</h3>
            <p style={styles.prefsSub}>Настройте предпочтения для более точных рекомендаций</p>
            <div style={styles.genreToggles}>
              {["Драма", "Sci-Fi", "Триллер", "Боевик", "Комедия", "История", "Криминал", "Приключения"].map((g) => (
                <GenreToggle key={g} label={g} />
              ))}
            </div>
          </div>

          <button style={styles.saveBtn} onClick={handleSave}>
            {saved ? "✓ Сохранено" : "Сохранить изменения"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value, disabled }) {
  return (
    <div style={ff.field}>
      <label style={ff.label}>{label}</label>
      <input
        style={{ ...ff.input, ...(disabled ? ff.disabled : {}) }}
        defaultValue={value}
        disabled={disabled}
        readOnly={disabled}
      />
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div style={sc.card}>
      <span style={sc.icon}>{icon}</span>
      <span style={sc.value}>{value}</span>
      <span style={sc.label}>{label}</span>
    </div>
  );
}

function GenreToggle({ label }) {
  const [on, setOn] = React.useState(Math.random() > 0.5);
  return (
    <button
      style={{ ...gt.btn, ...(on ? gt.on : {}) }}
      onClick={() => setOn(!on)}
    >
      {label}
    </button>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #0a0a0f 0%, #0f0e18 60%, #0d0d1c 100%)",
    fontFamily: "'DM Sans', sans-serif",
  },
  main: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "48px 40px",
    display: "flex",
    gap: 36,
    alignItems: "flex-start",
  },
  sidebar: {
    width: 260,
    flexShrink: 0,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16,
    padding: 20,
    position: "sticky",
    top: 100,
  },
  sidebarUser: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    paddingBottom: 20,
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    marginBottom: 16,
  },
  bigAvatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #c9a227, #e8c547)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: 700,
    color: "#0a0a0f",
    flexShrink: 0,
  },
  sidebarName: {
    color: "#fff",
    fontWeight: 600,
    fontSize: 15,
  },
  sidebarRole: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 12,
    marginTop: 2,
  },
  sidebarNav: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  sideNavItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.55)",
    cursor: "pointer",
    padding: "11px 14px",
    borderRadius: 10,
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    transition: "all 0.2s",
    textAlign: "left",
  },
  sideNavActive: {
    background: "rgba(201,162,39,0.1)",
    color: "#c9a227",
  },
  navIcon: {
    fontSize: 16,
    width: 20,
    textAlign: "center",
  },
  sideNavBadge: {
    marginLeft: "auto",
    background: "rgba(201,162,39,0.2)",
    color: "#c9a227",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    padding: "1px 8px",
  },
  sideNavDivider: {
    height: 1,
    background: "rgba(255,255,255,0.07)",
    margin: "8px 0",
  },
  logoutItem: {
    color: "rgba(255,100,100,0.7)",
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  contentHeader: {
    marginBottom: 28,
  },
  breadcrumb: {
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.3)",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    padding: 0,
    marginBottom: 14,
    display: "block",
    transition: "color 0.2s",
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 32,
    color: "#fff",
    fontWeight: 700,
    marginBottom: 6,
  },
  sectionSub: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
  },
  mockBanner: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    background: "rgba(201,162,39,0.07)",
    border: "1px solid rgba(201,162,39,0.2)",
    borderRadius: 12,
    padding: "14px 18px",
    marginBottom: 28,
  },
  mockIcon: {
    fontSize: 20,
    flexShrink: 0,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 28,
  },
  statsRow: {
    display: "flex",
    gap: 16,
    marginBottom: 28,
  },
  prefsSection: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14,
    padding: 24,
    marginBottom: 28,
  },
  prefsTitle: {
    color: "#fff",
    fontFamily: "'Playfair Display', serif",
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
  },
  prefsSub: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 13,
    marginBottom: 16,
  },
  genreToggles: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  saveBtn: {
    background: "linear-gradient(135deg, #c9a227, #e8c547)",
    border: "none",
    borderRadius: 12,
    padding: "13px 32px",
    color: "#0a0a0f",
    cursor: "pointer",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    transition: "opacity 0.2s",
  },
};

const ff = {
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    fontWeight: 500,
  },
  input: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: "12px 14px",
    color: "#fff",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
  },
  disabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};

const sc = {
  card: {
    flex: 1,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 12,
    padding: "18px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  icon: { fontSize: 24, marginBottom: 4 },
  value: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 28,
    color: "#c9a227",
    fontWeight: 700,
  },
  label: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
  },
};

const gt = {
  btn: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: "7px 16px",
    color: "rgba(255,255,255,0.5)",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    transition: "all 0.2s",
  },
  on: {
    background: "rgba(201,162,39,0.12)",
    border: "1px solid rgba(201,162,39,0.3)",
    color: "#c9a227",
  },
};
