import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export default function AuthPage() {
  const { login, register, authError, setAuthError } = useApp();
  const [mode, setMode]         = useState("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [surname, setSurname]   = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSwitch = (m) => {
    setMode(m);
    setAuthError("");
    setEmail(""); setPassword(""); setName(""); setSurname("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "login") {
      await login(email, password);
    } else {
      await register(surname, name, email, password);
    }
    setLoading(false);
  };

  return (
    <div style={styles.root}>
      <div style={styles.filmStrip}>
        {Array.from({ length: 20 }).map((_, i) => <div key={i} style={styles.filmFrame} />)}
      </div>
      <div style={styles.filmStrip2}>
        {Array.from({ length: 20 }).map((_, i) => <div key={i} style={styles.filmFrame} />)}
      </div>

      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🎬</span>
          <span style={styles.logoText}>CineMatch</span>
        </div>
        <p style={styles.tagline}>Твой персональный кинозал</p>

        <div style={styles.tabs}>
          <button style={{ ...styles.tab, ...(mode === "login" ? styles.tabActive : {}) }}
            onClick={() => handleSwitch("login")}>Вход</button>
          <button style={{ ...styles.tab, ...(mode === "register" ? styles.tabActive : {}) }}
            onClick={() => handleSwitch("register")}>Регистрация</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === "register" && (
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Фамилия</label>
                <input style={styles.input} type="text" placeholder="Иванов"
                  value={surname} onChange={e => setSurname(e.target.value)} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Имя</label>
                <input style={styles.input} type="text" placeholder="Иван"
                  value={name} onChange={e => setName(e.target.value)} required />
              </div>
            </div>
          )}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" placeholder="user@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Пароль</label>
            <input style={styles.input} type="password"
              placeholder={mode === "login" ? "Ваш пароль" : "Минимум 6 символов"}
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          {authError && <div style={styles.error}>{authError}</div>}

          <button type="submit"
            style={{ ...styles.btn, ...(loading ? styles.btnLoading : {}) }}
            disabled={loading}>
            {loading ? "Подождите..." : mode === "login" ? "Войти в систему →" : "Создать аккаунт →"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", background: "linear-gradient(135deg, #0a0a0f 0%, #12101a 50%, #0d0d18 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", fontFamily: "'DM Sans', sans-serif" },
  filmStrip: { position: "absolute", left: "4%", top: 0, bottom: 0, width: 60, display: "flex", flexDirection: "column", gap: 6, opacity: 0.08, paddingTop: 10 },
  filmStrip2: { position: "absolute", right: "4%", top: 0, bottom: 0, width: 60, display: "flex", flexDirection: "column", gap: 6, opacity: 0.08, paddingTop: 40 },
  filmFrame: { width: 60, height: 44, background: "#c9a227", borderRadius: 3, flexShrink: 0 },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 20, padding: "44px 48px", width: "100%", maxWidth: 480, backdropFilter: "blur(20px)", boxShadow: "0 32px 80px rgba(0,0,0,0.6)", position: "relative", zIndex: 1 },
  logo: { display: "flex", alignItems: "center", gap: 12, marginBottom: 6 },
  logoIcon: { fontSize: 32 },
  logoText: { fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#c9a227", letterSpacing: "-0.5px" },
  tagline: { color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 32, letterSpacing: "0.5px" },
  tabs: { display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4, marginBottom: 28, gap: 4 },
  tab: { flex: 1, padding: "10px 0", background: "transparent", border: "none", borderRadius: 8, color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, transition: "all 0.2s" },
  tabActive: { background: "rgba(201,162,39,0.15)", color: "#c9a227", fontWeight: 600 },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 7 },
  label: { color: "rgba(255,255,255,0.55)", fontSize: 12, letterSpacing: "0.8px", textTransform: "uppercase", fontWeight: 500 },
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: "none" },
  error: { background: "rgba(220,60,60,0.12)", border: "1px solid rgba(220,60,60,0.3)", borderRadius: 8, padding: "10px 14px", color: "#ff7070", fontSize: 13 },
  btn: { background: "linear-gradient(135deg, #c9a227, #e8c547)", border: "none", borderRadius: 12, padding: "15px 0", color: "#0a0a0f", fontSize: 15, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, cursor: "pointer", marginTop: 4 },
  btnLoading: { opacity: 0.7, cursor: "not-allowed" },
};
