import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import Header from "../components/Header";
import { getPosterUrl } from "../utils/moviePosters";

export default function HomePage() {
  const { currentMovie, skipMovie, addToFavorites, swipeDir, movieIndex, movies, moviesLoading } = useApp();
  const [imgError, setImgError] = useState(false);

  // Постер берём из TMDB по названию фильма, если нет — заглушка
  const posterUrl = currentMovie ? getPosterUrl(currentMovie.title) : null;

  if (moviesLoading && !currentMovie) {
    return (
      <div style={styles.root}>
        <Header />
        <div style={styles.loader}>
          <div style={styles.loaderIcon}>🎬</div>
          <p style={styles.loaderText}>Загружаем подборку фильмов...</p>
        </div>
      </div>
    );
  }

  if (!currentMovie) {
    return (
      <div style={styles.root}>
        <Header />
        <div style={styles.loader}>
          <div style={styles.loaderIcon}>🎉</div>
          <p style={styles.loaderText}>Вы просмотрели все фильмы!</p>
        </div>
      </div>
    );
  }

  const cardStyle = {
    ...styles.card,
    ...(swipeDir === "left" ? styles.swipeLeft : {}),
    ...(swipeDir === "right" ? styles.swipeRight : {}),
  };

  return (
    <div style={styles.root}>
      <Header />
      <div style={styles.main}>
        {/* Левая колонка — инфо */}
        <div style={styles.leftCol}>
          <h1 style={styles.heading}>Что смотрим<br />
            <span style={styles.headingAccent}>сегодня?</span>
          </h1>
          <p style={styles.sub}>
            Листайте карточки, добавляйте понравившиеся фильмы в избранное.
          </p>

          <div style={styles.counter}>
            <span style={styles.counterNum}>{movieIndex + 1}</span>
            <span style={styles.counterDivider}>/</span>
            <span style={styles.counterTotal}>{movies.length}</span>
          </div>

          {currentMovie.genres && currentMovie.genres.length > 0 && (
            <div style={styles.genrePills}>
              {currentMovie.genres.map((g) => (
                <span key={g.id} style={styles.genrePill}>{g.name}</span>
              ))}
            </div>
          )}

          <div style={styles.meta}>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Год</span>
              <span style={styles.metaValue}>{currentMovie.year || "—"}</span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>ID</span>
              <span style={styles.metaValue}>#{currentMovie.id}</span>
            </div>
          </div>

          {currentMovie.description && (
            <p style={styles.desc}>{currentMovie.description}</p>
          )}

          <div style={styles.actions}>
            <button style={styles.skipBtn} onClick={skipMovie}>
              <span style={styles.skipIcon}>✕</span>
              <span>Пропустить</span>
            </button>
            <button style={styles.likeBtn} onClick={addToFavorites}>
              <span>♥</span>
              <span>В избранное</span>
            </button>
          </div>
        </div>

        {/* Правая колонка — карточка */}
        <div style={styles.rightCol}>
          <div style={cardStyle} key={currentMovie.id}>
            {!imgError && posterUrl ? (
              <img src={posterUrl} alt={currentMovie.title}
                style={styles.poster} onError={() => setImgError(true)} />
            ) : (
              <div style={styles.posterFallback}>
                <span style={{ fontSize: 64 }}>🎬</span>
                <span style={{ color: "rgba(255,255,255,0.4)", marginTop: 12, fontSize: 14 }}>
                  {currentMovie.title}
                </span>
              </div>
            )}
            <div style={styles.cardOverlay}>
              <h2 style={styles.movieTitle}>{currentMovie.title}</h2>
            </div>
            {swipeDir === "left"  && <div style={styles.swipeBadgeLeft}>ПРОПУСТИТЬ</div>}
            {swipeDir === "right" && <div style={styles.swipeBadgeRight}>В ИЗБРАННОЕ ♥</div>}
          </div>
          <div style={styles.swipeHint}>
            <span>← Пропустить</span>
            <span>В избранное →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", background: "linear-gradient(160deg, #0a0a0f 0%, #0f0e18 60%, #0d0d1c 100%)", fontFamily: "'DM Sans', sans-serif" },
  loader: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "70vh", gap: 16 },
  loaderIcon: { fontSize: 64 },
  loaderText: { color: "rgba(255,255,255,0.5)", fontSize: 16 },
  main: { maxWidth: 1100, margin: "0 auto", padding: "56px 40px", display: "flex", gap: 64, alignItems: "center" },
  leftCol: { flex: 1, minWidth: 0 },
  heading: { fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 16 },
  headingAccent: { color: "#c9a227", fontStyle: "italic" },
  sub: { color: "rgba(255,255,255,0.45)", fontSize: 15, lineHeight: 1.7, marginBottom: 32, maxWidth: 440 },
  counter: { display: "flex", alignItems: "baseline", gap: 6, marginBottom: 20 },
  counterNum: { fontFamily: "'Playfair Display', serif", fontSize: 36, color: "#c9a227", fontWeight: 700 },
  counterDivider: { color: "rgba(255,255,255,0.2)", fontSize: 20 },
  counterTotal: { color: "rgba(255,255,255,0.3)", fontSize: 20 },
  genrePills: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 },
  genrePill: { background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.25)", color: "#c9a227", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" },
  meta: { display: "flex", gap: 28, marginBottom: 20 },
  metaItem: { display: "flex", flexDirection: "column", gap: 3 },
  metaLabel: { color: "rgba(255,255,255,0.3)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 500 },
  metaValue: { color: "#fff", fontSize: 14, fontWeight: 500 },
  desc: { color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.75, marginBottom: 36, maxWidth: 440 },
  actions: { display: "flex", gap: 14 },
  skipBtn: { display: "flex", alignItems: "center", gap: 9, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "14px 28px", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 },
  skipIcon: { fontSize: 16, color: "rgba(255,100,100,0.8)" },
  likeBtn: { display: "flex", alignItems: "center", gap: 9, background: "linear-gradient(135deg, #c9a227, #e8c547)", border: "none", borderRadius: 12, padding: "14px 28px", color: "#0a0a0f", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 },
  rightCol: { flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 },
  card: { width: 320, height: 480, borderRadius: 20, overflow: "hidden", position: "relative", boxShadow: "0 40px 80px rgba(0,0,0,0.7)", transition: "transform 0.35s cubic-bezier(.68,-0.55,.27,1.55), opacity 0.35s" },
  swipeLeft: { transform: "translateX(-120%) rotate(-15deg)", opacity: 0 },
  swipeRight: { transform: "translateX(120%) rotate(15deg)", opacity: 0 },
  poster: { width: "100%", height: "100%", objectFit: "cover" },
  posterFallback: { width: "100%", height: "100%", background: "rgba(255,255,255,0.03)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  cardOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)", padding: "60px 20px 20px" },
  movieTitle: { fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", fontWeight: 700, margin: 0 },
  swipeBadgeLeft: { position: "absolute", top: 24, right: 20, background: "rgba(220,60,60,0.85)", color: "#fff", borderRadius: 8, padding: "8px 14px", fontWeight: 700, fontSize: 13 },
  swipeBadgeRight: { position: "absolute", top: 24, left: 20, background: "rgba(100,200,100,0.85)", color: "#fff", borderRadius: 8, padding: "8px 14px", fontWeight: 700, fontSize: 13 },
  swipeHint: { display: "flex", justifyContent: "space-between", width: "100%", color: "rgba(255,255,255,0.2)", fontSize: 12 },
};
