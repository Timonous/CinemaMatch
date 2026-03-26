import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as authApi      from "../api/auth";
import * as usersApi     from "../api/users";
import * as moviesApi    from "../api/movies";
import * as favouritesApi from "../api/favourites";
import * as groupsApi    from "../api/groups";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Auth & User ───────────────────────────────────────────────────────────
  const [user, setUser]         = useState(null);        // { user_id, email, name, surname }
  const [authError, setAuthError] = useState("");

  // ── Navigation ────────────────────────────────────────────────────────────
  const [page, setPage]         = useState("auth");      // auth|home|favorites|profile|groups

  // ── Movies (подборка) ─────────────────────────────────────────────────────
  const [movies, setMovies]     = useState([]);          // список из API
  const [moviesTotal, setMoviesTotal] = useState(0);
  const [moviesPage, setMoviesPage]   = useState(1);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [movieIndex, setMovieIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState(null);

  // ── Favourites ────────────────────────────────────────────────────────────
  const [favorites, setFavorites] = useState([]);        // MovieShort[]
  const [favLoading, setFavLoading] = useState(false);

  // ── Groups ────────────────────────────────────────────────────────────────
  const [myGroups, setMyGroups]   = useState([]);        // GroupShort[]
  const [groupsLoading, setGroupsLoading] = useState(false);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const saveToken = (token) => localStorage.setItem("access_token", token);
  const clearToken = () => localStorage.removeItem("access_token");

  // ── Загрузить фильмы (следующая страница / первая) ────────────────────────
  const loadMovies = useCallback(async (pageNum = 1) => {
    setMoviesLoading(true);
    try {
      const data = await moviesApi.getMovies({ page: pageNum, limit: 20 });
      setMoviesTotal(data.total);
      setMoviesPage(pageNum);
      if (pageNum === 1) {
        setMovies(data.items);
        setMovieIndex(0);
      } else {
        setMovies((prev) => [...prev, ...data.items]);
      }
    } catch (e) {
      console.error("loadMovies:", e.message);
    } finally {
      setMoviesLoading(false);
    }
  }, []);

  // ── Загрузить избранное ───────────────────────────────────────────────────
  const loadFavourites = useCallback(async () => {
    setFavLoading(true);
    try {
      const data = await favouritesApi.getFavourites({ limit: 100 });
      setFavorites(data.items);
    } catch (e) {
      console.error("loadFavourites:", e.message);
    } finally {
      setFavLoading(false);
    }
  }, []);

  // ── Загрузить группы ──────────────────────────────────────────────────────
  const loadGroups = useCallback(async () => {
    setGroupsLoading(true);
    try {
      const data = await groupsApi.getGroups();
      setMyGroups(data);
    } catch (e) {
      console.error("loadGroups:", e.message);
    } finally {
      setGroupsLoading(false);
    }
  }, []);

  // ── Восстановить сессию при перезагрузке ─────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    usersApi.getMe()
      .then((profile) => {
        setUser(profile);
        setPage("home");
        loadMovies(1);
        loadFavourites();
        loadGroups();
      })
      .catch(() => clearToken());
  }, []); // eslint-disable-line

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    setAuthError("");
    try {
      const data = await authApi.login({ email, password });
      saveToken(data.access_token);
      const profile = await usersApi.getMe();
      setUser(profile);
      setPage("home");
      loadMovies(1);
      loadFavourites();
      loadGroups();
      return true;
    } catch (e) {
      setAuthError(e.message || "Неверный email или пароль");
      return false;
    }
  };

  // ── Register ──────────────────────────────────────────────────────────────
  const register = async (surname, name, email, password) => {
    setAuthError("");
    try {
      await authApi.register({ surname, name, email, password });
      // После регистрации сразу логинимся
      return await login(email, password);
    } catch (e) {
      setAuthError(e.message || "Ошибка регистрации");
      return false;
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    clearToken();
    setUser(null);
    setMovies([]);
    setFavorites([]);
    setMyGroups([]);
    setMovieIndex(0);
    setPage("auth");
  };

  // ── Карточки фильмов ──────────────────────────────────────────────────────
  const currentMovie = movies[movieIndex] || null;

  const advanceMovie = () => {
    const nextIndex = movieIndex + 1;
    // Если подходим к концу — подгружаем следующую страницу
    if (nextIndex >= movies.length) {
      const hasMore = movies.length < moviesTotal;
      if (hasMore) {
        loadMovies(moviesPage + 1);
      } else {
        // Начать сначала
        setMovieIndex(0);
        return;
      }
    }
    setMovieIndex(nextIndex < movies.length ? nextIndex : 0);
  };

  const skipMovie = () => {
    setSwipeDir("left");
    setTimeout(() => {
      setSwipeDir(null);
      advanceMovie();
    }, 350);
  };

  const addToFavorites = async () => {
    if (!currentMovie) return;
    setSwipeDir("right");
    try {
      await favouritesApi.addFavourite(currentMovie.id);
      // Обновляем список избранного
      setFavorites((prev) =>
        prev.find((m) => m.id === currentMovie.id) ? prev : [...prev, currentMovie]
      );
    } catch (e) {
      // 409 — уже в избранном, не показываем ошибку
      if (!e.message?.includes("уже")) console.error(e.message);
    }
    setTimeout(() => {
      setSwipeDir(null);
      advanceMovie();
    }, 350);
  };

  const removeFromFavorites = async (id) => {
    try {
      await favouritesApi.removeFavourite(id);
      setFavorites((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      console.error("removeFromFavorites:", e.message);
    }
  };

  // ── Группы ────────────────────────────────────────────────────────────────
  const createGroup = async (name) => {
    if (!name.trim()) return { ok: false, error: "Введите название группы" };
    try {
      const group = await groupsApi.createGroup(name.trim());
      setMyGroups((prev) => [...prev, group]);
      return { ok: true, group };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  };

  // Присоединиться по email (invite себя) — API принимает email или user_id
  const joinGroupByEmail = async (email) => {
    // Нельзя напрямую «вступить по коду» через этот API —
    // только владелец группы может пригласить. Поэтому для демо
    // используем invite через email текущего пользователя.
    // В реальном сценарии: нужен эндпоинт join-by-code или QR-ссылка.
    return { ok: false, error: "Для вступления попросите создателя группы добавить вас по email" };
  };

  // Пригласить пользователя по email в группу
  const inviteToGroup = async (group_id, email) => {
    try {
      await groupsApi.inviteToGroup(group_id, { email });
      // Обновим детали группы
      const updated = await groupsApi.getGroup(group_id);
      setMyGroups((prev) => prev.map((g) => g.group_id === group_id ? { ...g, ...updated } : g));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  };

  const leaveGroup = async (group_id) => {
    if (!user) return;
    try {
      await groupsApi.leaveGroup(group_id, user.user_id);
      setMyGroups((prev) => prev.filter((g) => g.group_id !== group_id));
    } catch (e) {
      console.error("leaveGroup:", e.message);
    }
  };

  const getGroupDetail = async (group_id) => {
    try {
      return await groupsApi.getGroup(group_id);
    } catch (e) {
      return null;
    }
  };

  const getGroupRecommendations = async (group_id) => {
    try {
      const data = await groupsApi.getGroupRecommendations(group_id);
      return { ok: true, data };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  };

  // ── Профиль ───────────────────────────────────────────────────────────────
  const updateProfile = async ({ name, surname, password }) => {
    try {
      const updated = await usersApi.updateMe({ name, surname, password });
      setUser(updated);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  };

  return (
    <AppContext.Provider
      value={{
        // auth
        user, authError, setAuthError, login, register, logout, updateProfile,
        // nav
        page, setPage,
        // movies
        movies, currentMovie, moviesLoading, moviesTotal, movieIndex,
        swipeDir, skipMovie, addToFavorites, loadMovies,
        // favorites
        favorites, favLoading, removeFromFavorites, loadFavourites,
        // groups
        myGroups, groupsLoading, createGroup, joinGroupByEmail,
        inviteToGroup, leaveGroup, getGroupDetail, loadGroups,
        getGroupRecommendations,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
