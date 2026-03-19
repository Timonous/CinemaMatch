import React from "react";
import { useApp } from "../context/AppContext";
import Header from "../components/Header";

export default function FavoritesPage() {
  const { favorites, removeFromFavorites, setPage } = useApp();

  return (
    <div style={styles.root}>
      <Header />
      <div style={styles.main}>
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.heading}>
              Избранное
              <span style={styles.countBadge}>{favorites.length}</span>
            </h1>
            <p style={styles.sub}>Фильмы, которые вы отметили как интересные</p>
          </div>
          <button style={styles.backBtn} onClick={() => setPage("home")}>
            ← Вернуться к подборке
          </button>
        </div>

        {favorites.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🎬</div>
            <h3 style={styles.emptyTitle}>Список пока пуст</h3>
            <p style={styles.emptyText}>
              Добавляйте фильмы в избранное на главной странице,<br />
              нажимая кнопку «В избранное»
            </p>
            <button style={styles.emptyBtn} onClick={() => setPage("home")}>
              Перейти к подборке →
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onRemove={removeFromFavorites} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MovieCard({ movie, onRemove }) {
  const [hovered, setHovered] = React.useState(false);
  const [imgError, setImgError] = React.useState(false);

  return (
    <div
      style={{ ...styles.card, ...(hovered ? styles.cardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.posterWrap}>
        {!imgError ? (
          <img
            src={movie.poster}
            alt={movie.title}
            style={styles.poster}
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={styles.posterFallback}>🎬</div>
        )}
        <div style={styles.ratingBadge}>★ {movie.rating}</div>
        {hovered && (
          <div style={styles.overlay}>
            <p style={styles.overlayDesc}>{movie.description.slice(0, 120)}...</p>
            <button
              style={styles.removeBtn}
              onClick={() => onRemove(movie.id)}
            >
              ✕ Удалить из избранного
            </button>
          </div>
        )}
      </div>
      <div style={styles.info}>
        <h3 style={styles.title}>{movie.title}</h3>
        <div style={styles.meta}>
          <span style={styles.year}>{movie.year}</span>
          <div style={styles.genres}>
            {movie.genre.map((g) => (
              <span key={g} style={styles.genre}>{g}</span>
            ))}
          </div>
        </div>
        <p style={styles.director}>{movie.director}</p>
      </div>
    </div>
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
  },
  topBar: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 40,
    flexWrap: "wrap",
    gap: 16,
  },
  heading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 42,
    fontWeight: 700,
    color: "#fff",
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  countBadge: {
    background: "linear-gradient(135deg, #c9a227, #e8c547)",
    color: "#0a0a0f",
    borderRadius: 20,
    fontSize: 16,
    fontWeight: 700,
    padding: "3px 12px",
    fontFamily: "'DM Sans', sans-serif",
  },
  sub: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
  },
  backBtn: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "11px 20px",
    color: "rgba(255,255,255,0.6)",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 26,
    color: "#fff",
    fontWeight: 700,
  },
  emptyText: {
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    lineHeight: 1.7,
    fontSize: 15,
  },
  emptyBtn: {
    marginTop: 12,
    background: "linear-gradient(135deg, #c9a227, #e8c547)",
    border: "none",
    borderRadius: 12,
    padding: "13px 28px",
    color: "#0a0a0f",
    cursor: "pointer",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
    gap: 24,
  },
  card: {
    borderRadius: 14,
    overflow: "hidden",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  cardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
    borderColor: "rgba(201,162,39,0.25)",
  },
  posterWrap: {
    position: "relative",
    aspectRatio: "2/3",
    overflow: "hidden",
  },
  poster: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  posterFallback: {
    width: "100%",
    height: "100%",
    background: "rgba(255,255,255,0.03)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 48,
  },
  ratingBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "rgba(0,0,0,0.75)",
    color: "#e8c547",
    borderRadius: 8,
    padding: "4px 10px",
    fontSize: 12,
    fontWeight: 700,
    backdropFilter: "blur(8px)",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.88)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: 16,
    gap: 12,
  },
  overlayDesc: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    lineHeight: 1.6,
  },
  removeBtn: {
    background: "rgba(220,60,60,0.15)",
    border: "1px solid rgba(220,60,60,0.35)",
    borderRadius: 8,
    padding: "9px 14px",
    color: "#ff7070",
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    transition: "all 0.2s",
  },
  info: {
    padding: "14px 14px 16px",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 8,
    lineHeight: 1.3,
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 6,
  },
  year: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 12,
  },
  genres: {
    display: "flex",
    gap: 4,
    flexWrap: "wrap",
  },
  genre: {
    background: "rgba(201,162,39,0.1)",
    color: "rgba(201,162,39,0.8)",
    borderRadius: 4,
    padding: "2px 7px",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.3px",
  },
  director: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 12,
  },
};
