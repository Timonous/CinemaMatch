import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import Header from "../components/Header";

export default function ProfilePage() {
  const { user, logout, setPage, favorites, updateProfile } = useApp();
  const [name, setName]       = useState(user?.name || "");
  const [surname, setSurname] = useState(user?.surname || "");
  const [password, setPassword] = useState("");
  const [saving, setSaving]   = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    const payload = {};
    if (name !== user?.name) payload.name = name;
    if (surname !== user?.surname) payload.surname = surname;
    if (password) payload.password = password;

    const res = await updateProfile(payload);
    setSaving(false);
    if (res.ok) {
      setSaveMsg("✓ Сохранено");
      setPassword("");
      setTimeout(() => setSaveMsg(""), 2500);
    } else {
      setSaveMsg("Ошибка: " + res.error);
    }
  };

  return (
    <div style={styles.root}>
      <Header />
      <div style={styles.main}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarUser}>
            <div style={styles.bigAvatar}>{(user?.name || "?")[0].toUpperCase()}</div>
            <div>
              <div style={styles.sidebarName}>{user?.name} {user?.surname}</div>
              <div style={styles.sidebarEmail}>{user?.email}</div>
            </div>
          </div>
          <nav style={styles.sidebarNav}>
            <button style={{ ...styles.sideNavItem, ...styles.sideNavActive }}>
              <span style={styles.navIcon}>👤</span>Персональные данные
            </button>
            <button style={styles.sideNavItem} onClick={() => setPage("favorites")}>
              <span style={styles.navIcon}>♥</span>Избранное
              {favorites.length > 0 && <span style={styles.sideNavBadge}>{favorites.length}</span>}
            </button>
            <button style={styles.sideNavItem} onClick={() => setPage("groups")}>
              <span style={styles.navIcon}>👥</span>Мои группы
            </button>
            <div style={styles.sideNavDivider} />
            <button style={{ ...styles.sideNavItem, ...styles.logoutItem }} onClick={logout}>
              <span style={styles.navIcon}>→</span>Выйти из аккаунта
            </button>
          </nav>
        </aside>

        <div style={styles.content}>
          <button style={styles.breadcrumb} onClick={() => setPage("home")}>← На главную</button>
          <h2 style={styles.sectionTitle}>Персональные данные</h2>
          <p style={styles.sectionSub}>Управление информацией профиля</p>

          <div style={styles.formGrid}>
            <FormField label="Имя" value={name} onChange={setName} />
            <FormField label="Фамилия" value={surname} onChange={setSurname} />
            <FormField label="Email" value={user?.email || ""} disabled />
            <FormField label="Новый пароль" value={password} onChange={setPassword}
              type="password" placeholder="Оставьте пустым, чтобы не менять" />
          </div>

          <div style={styles.statsRow}>
            <StatCard icon="♥" value={favorites.length} label="В избранном" />
          </div>

          {saveMsg && (
            <div style={{ ...styles.saveMsg, ...(saveMsg.startsWith("✓") ? styles.saveMsgOk : styles.saveMsgErr) }}>
              {saveMsg}
            </div>
          )}

          <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? "Сохраняем..." : "Сохранить изменения"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, disabled, type = "text", placeholder }) {
  return (
    <div style={ff.field}>
      <label style={ff.label}>{label}</label>
      <input style={{ ...ff.input, ...(disabled ? ff.disabled : {}) }}
        type={type} value={value} disabled={disabled}
        placeholder={placeholder}
        onChange={e => onChange && onChange(e.target.value)} />
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

const styles = {
  root: { minHeight: "100vh", background: "linear-gradient(160deg, #0a0a0f 0%, #0f0e18 60%, #0d0d1c 100%)", fontFamily: "'DM Sans', sans-serif" },
  main: { maxWidth: 1100, margin: "0 auto", padding: "48px 40px", display: "flex", gap: 36, alignItems: "flex-start" },
  sidebar: { width: 260, flexShrink: 0, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20, position: "sticky", top: 100 },
  sidebarUser: { display: "flex", alignItems: "center", gap: 14, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 16 },
  bigAvatar: { width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #c9a227, #e8c547)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#0a0a0f", flexShrink: 0 },
  sidebarName: { color: "#fff", fontWeight: 600, fontSize: 15 },
  sidebarEmail: { color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 2 },
  sidebarNav: { display: "flex", flexDirection: "column", gap: 4 },
  sideNavItem: { display: "flex", alignItems: "center", gap: 10, background: "transparent", border: "none", color: "rgba(255,255,255,0.55)", cursor: "pointer", padding: "11px 14px", borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, textAlign: "left" },
  sideNavActive: { background: "rgba(201,162,39,0.1)", color: "#c9a227" },
  navIcon: { fontSize: 16, width: 20, textAlign: "center" },
  sideNavBadge: { marginLeft: "auto", background: "rgba(201,162,39,0.2)", color: "#c9a227", borderRadius: 20, fontSize: 11, fontWeight: 700, padding: "1px 8px" },
  sideNavDivider: { height: 1, background: "rgba(255,255,255,0.07)", margin: "8px 0" },
  logoutItem: { color: "rgba(255,100,100,0.7)" },
  content: { flex: 1, minWidth: 0 },
  breadcrumb: { background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", padding: 0, marginBottom: 14, display: "block" },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 32, color: "#fff", fontWeight: 700, marginBottom: 6 },
  sectionSub: { color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 28 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 },
  statsRow: { display: "flex", gap: 16, marginBottom: 28 },
  saveMsg: { borderRadius: 8, padding: "10px 16px", fontSize: 14, marginBottom: 16 },
  saveMsgOk: { background: "rgba(100,200,100,0.1)", border: "1px solid rgba(100,200,100,0.25)", color: "#6dc96d" },
  saveMsgErr: { background: "rgba(220,60,60,0.1)", border: "1px solid rgba(220,60,60,0.25)", color: "#ff7070" },
  saveBtn: { background: "linear-gradient(135deg, #c9a227, #e8c547)", border: "none", borderRadius: 12, padding: "13px 32px", color: "#0a0a0f", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 },
};
const ff = {
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { color: "rgba(255,255,255,0.4)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 500 },
  input: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" },
  disabled: { opacity: 0.5, cursor: "not-allowed" },
};
const sc = {
  card: { flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "18px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  icon: { fontSize: 24, marginBottom: 4 },
  value: { fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#c9a227", fontWeight: 700 },
  label: { color: "rgba(255,255,255,0.4)", fontSize: 12 },
};
