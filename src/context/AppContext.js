import React, { createContext, useContext, useState } from "react";
import { TEST_USERS, MOVIES } from "../data/movies";

const AppContext = createContext(null);

// Генерация 6-значного кода группы
const genCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

// Предзаполненные тестовые группы (глобальный реестр — имитирует «сервер»)
const GLOBAL_GROUPS_REGISTRY = {
  "DEMO01": {
    id: "DEMO01",
    name: "Киноклуб «Пятница»",
    code: "DEMO01",
    createdBy: "admin",
    members: [
      { name: "admin", displayName: "Администратор", favorites: [1, 3, 7, 9] },
      { name: "demo",  displayName: "Demo User",     favorites: [2, 4, 8, 11] },
    ],
    createdAt: "2026-03-10",
  },
  "SCIFI7": {
    id: "SCIFI7",
    name: "Любители Sci-Fi",
    code: "SCIFI7",
    createdBy: "user",
    members: [
      { name: "user", displayName: "Тестовый Пользователь", favorites: [1, 2, 7, 11] },
    ],
    createdAt: "2026-03-15",
  },
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState("auth");
  const [authError, setAuthError] = useState("");
  const [movieIndex, setMovieIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState(null);

  // groups: массив объектов групп, к которым принадлежит текущий пользователь
  const [myGroups, setMyGroups] = useState([]);
  // реестр всех групп (мок «сервера»)
  const [groupsRegistry, setGroupsRegistry] = useState(GLOBAL_GROUPS_REGISTRY);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const login = (name, password) => {
    const found = TEST_USERS.find(
      (u) => u.name === name && u.password === password
    );
    if (found) {
      setUser(found);
      setPage("home");
      setAuthError("");
      // Загружаем группы пользователя из реестра
      const userGroups = Object.values(GLOBAL_GROUPS_REGISTRY).filter((g) =>
        g.members.some((m) => m.name === found.name)
      );
      setMyGroups(userGroups);
      return true;
    }
    setAuthError("Неверное имя пользователя или пароль");
    return false;
  };

  const register = (name, password) => {
    if (!name || !password) { setAuthError("Заполните все поля"); return false; }
    const newUser = { name, password, displayName: name };
    setUser(newUser);
    setPage("home");
    setAuthError("");
    setMyGroups([]);
    return true;
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
    setMovieIndex(0);
    setMyGroups([]);
    setSelectedGroupId(null);
    setPage("auth");
  };

  // Создать группу
  const createGroup = (groupName) => {
    if (!groupName.trim()) return { ok: false, error: "Введите название группы" };
    const code = genCode();
    const newGroup = {
      id: code,
      name: groupName.trim(),
      code,
      createdBy: user.name,
      members: [
        {
          name: user.name,
          displayName: user.displayName || user.name,
          favorites: favorites.map((m) => m.id),
        },
      ],
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setGroupsRegistry((prev) => ({ ...prev, [code]: newGroup }));
    setMyGroups((prev) => [...prev, newGroup]);
    return { ok: true, group: newGroup };
  };

  // Присоединиться к группе по коду
  const joinGroup = (code) => {
    const upper = code.trim().toUpperCase();
    const group = groupsRegistry[upper];
    if (!group) return { ok: false, error: "Группа с таким кодом не найдена" };
    if (myGroups.some((g) => g.id === upper))
      return { ok: false, error: "Вы уже состоите в этой группе" };

    const memberEntry = {
      name: user.name,
      displayName: user.displayName || user.name,
      favorites: favorites.map((m) => m.id),
    };
    const updated = {
      ...group,
      members: [...group.members, memberEntry],
    };
    setGroupsRegistry((prev) => ({ ...prev, [upper]: updated }));
    setMyGroups((prev) => [...prev, updated]);
    return { ok: true, group: updated };
  };

  // Покинуть группу
  const leaveGroup = (groupId) => {
    setMyGroups((prev) => prev.filter((g) => g.id !== groupId));
    setGroupsRegistry((prev) => {
      const g = prev[groupId];
      if (!g) return prev;
      return {
        ...prev,
        [groupId]: {
          ...g,
          members: g.members.filter((m) => m.name !== user.name),
        },
      };
    });
    if (selectedGroupId === groupId) setSelectedGroupId(null);
  };

  // Получить фильмы группы — пересечение избранного всех участников
  const getGroupMovies = (groupId) => {
    const group = groupsRegistry[groupId] || myGroups.find((g) => g.id === groupId);
    if (!group) return [];
    if (group.members.length < 2) {
      // Один участник — просто его избранное
      const ids = group.members[0]?.favorites || [];
      return MOVIES.filter((m) => ids.includes(m.id));
    }
    // Считаем, сколько участников добавили каждый фильм — сортируем по популярности
    const counts = {};
    group.members.forEach((m) => {
      (m.favorites || []).forEach((id) => {
        counts[id] = (counts[id] || 0) + 1;
      });
    });
    return MOVIES.filter((m) => counts[m.id])
      .sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0));
  };

  const currentMovie = MOVIES[movieIndex % MOVIES.length];

  const skipMovie = () => {
    setSwipeDir("left");
    setTimeout(() => { setMovieIndex((i) => (i + 1) % MOVIES.length); setSwipeDir(null); }, 350);
  };

  const addToFavorites = () => {
    setSwipeDir("right");
    setFavorites((prev) => {
      if (!prev.find((m) => m.id === currentMovie.id)) return [...prev, currentMovie];
      return prev;
    });
    setTimeout(() => { setMovieIndex((i) => (i + 1) % MOVIES.length); setSwipeDir(null); }, 350);
  };

  const removeFromFavorites = (id) => {
    setFavorites((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        user, page, setPage,
        authError, setAuthError,
        login, register, logout,
        favorites, addToFavorites, removeFromFavorites,
        currentMovie, skipMovie, swipeDir,
        totalMovies: MOVIES.length, movieIndex,
        myGroups, createGroup, joinGroup, leaveGroup, getGroupMovies,
        selectedGroupId, setSelectedGroupId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
