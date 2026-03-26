/**
 * moviePosters.js
 *
 * Маппинг названий фильмов (из БД) → TMDB poster path.
 * Используется на HomePage и FavoritesPage для отображения постеров
 * без изменения структуры БД.
 *
 * Базовый URL постера: https://image.tmdb.org/t/p/w500/<posterPath>
 *
 * Как обновить/добавить постер:
 *   1. Зайдите на https://www.themoviedb.org и найдите фильм.
 *   2. Откройте DevTools → Network → найдите запрос к image.tmdb.org.
 *   3. Скопируйте имя файла (например, gEU2QniE6E77NI6lCU6MxlNBvIx.jpg).
 */

const TMDB_BASE_URL = "https://image.tmdb.org/t/p/w500/";

/** Маппинг: название фильма из БД → имя файла постера на TMDB */
const POSTER_MAP = {
  // ── Классика и культовые ──────────────────────────────────────────────
  "Побег из Шоушенка":              "lyQBXzOQSuE59IsHyhrp0qIiPAz.jpg",
  "Крёстный отец":                  "3bhkrj58Vtu7enYsLlegkAzin1x.jpg",
  "Тёмный рыцарь":                  "qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  "Список Шиндлера":                "sF1U4EUQS8YHUYjNl3dlPqGkaPu.jpg",
  "Властелин колец: Возвращение короля": "rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
  "Форрест Гамп":                   "arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
  "Начало":                         "9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
  "Матрица":                        "f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
  "Бойцовский клуб":                "pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  "Интерстеллар":                   "gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",

  // ── Зарубежная классика ───────────────────────────────────────────────
  "Криминальное чтиво":             "d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
  "Хороший, плохой, злой":          "bX2CZB0Q0TlZfAGNQYPeYeSbJqh.jpg",
  "Унесённые призраками":           "39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
  "Семь самураев":                  "8OKmBV5BUFzmozIC3pPWKHy17kx.jpg",
  "Паразиты":                       "7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",

  // ── Современные хиты ──────────────────────────────────────────────────
  "Дюна":                           "d5NXSklpcvwE3HP2SmweEvgmR6O.jpg",
  "Мстители: Финал":                "or06FN3Dka6smtcleQTzwHQbs9.jpg",
  "Джокер":                         "udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
  "Однажды в Голливуде":            "8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg",
  "Оппенгеймер":                    "8Gxv8gSFCU0XGDg8YcjwSmiwz1n.jpg",
  "Барби":                          "iuFNMS8vlbzS10s0kPfkOJeQJjP.jpg",
  "Всё везде и сразу":              "w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
  "Дюна: Часть вторая":             "1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
  "Прошлые жизни":                  "k3waqVXSnYLtIHuWKuRDDdlfO4L.jpg",

  // ── Анимация ──────────────────────────────────────────────────────────
  "Король Лев":                     "sCanFAOA41NowiqhAadSiGXBfSW.jpg",
  "Головоломка":                    "d8UyX2bKBdBFbIrGFKWjKBRQXWo.jpg",
  "Паук-Человек: Через вселенные":  "iiZZdoQBEYBv6id8MChcujnW36E.jpg",
  "Ходячий замок":                  "TkOqUZxhBMGpFXxQlM4PiEIBnjh.jpg",

  // ── Отечественное кино ────────────────────────────────────────────────
  // Для этих фильмов постеры TMDB менее надёжны — при ошибке
  // компонент автоматически покажет заглушку через onError.
  "Брат":                           "qJ2iANeGsLAVSe7aelLniHXAFOt.jpg",
  "Сталкер":                        "fPDNiiBHZSEODlBv2NG0hBLFJQb.jpg",
  "Москва слезам не верит":         "o5D7BbAjq1okEISGsA8RnT0Yq8K.jpg",
  "Иди и смотри":                   "2r6Ugd5eLUAIbV1vHGbaOyLblKd.jpg",

  // ── Фантастика и приключения ──────────────────────────────────────────
  "Назад в будущее":                "fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg",
  "Инопланетянин":                  "an0nD6uq975rfre51Yn9o1M9n0p.jpg",
  "Гравитация":                     "kZ2nZw8D681aFBGUetGfrOBbHNF.jpg",
  "Прибытие":                       "x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
  "Звёздные войны: Новая надежда":  "6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",

  // ── Триллеры и детективы ──────────────────────────────────────────────
  "Семь":                           "6yoghtyTpznpBik8EngEmJskVnS.jpg",
  "Молчание ягнят":                 "uS9m8OBk1A8eM75W8uqpMzRli71.jpg",
  "Психо":                          "yz3LIuH3KbNAfMQBX5F1eMlEMWg.jpg",
  "Исчезнувшая":                    "3krap2rxrMutJv5z2DmLMkjRVpP.jpg",

  // ── Мелодрамы / романтика ─────────────────────────────────────────────
  "Титаник":                        "9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
  "Ла-Ла Ленд":                     "uDO8zWDhfWwoFdKS4fzkUJt0Bs0.jpg",
  "Вечное сияние чистого разума":   "5MwkWH9tYHv3mV9OdYTMR5qreIb.jpg",

  // ── Биографические ────────────────────────────────────────────────────
  "Социальная сеть":                "n0ybibhJtQ5icDqTp8eRytcIHso.jpg",
  "Игра в имитацию":                "noUp0XOqIcmgefRnRZa1nhtRvWO.jpg",
  "Король говорит!":                "nAzBDGOVeYOBOG37dUNTNjVPTTs.jpg",

  // ── Комедии ───────────────────────────────────────────────────────────
  "Большой Лебовски":               "xxc6vN12vTJBJGGgBFo7HtKMDQ0.jpg",
  "Достать ножи":                   "pThyQovXQrpS26OykarmLNedQQE.jpg",
  "Невидимая сторона":              "nGJLBmKsDpK8rz0RRgHjGKhKBBb.jpg",
};

/**
 * Возвращает полный URL постера для фильма.
 * Если постер для данного названия не найден в карте — возвращает null,
 * и компонент отобразит заглушку.
 *
 * @param {string} title - название фильма (точно как в БД)
 * @returns {string|null}
 */
export function getPosterUrl(title) {
  const filename = POSTER_MAP[title];
  if (!filename) return null;
  return `${TMDB_BASE_URL}${filename}`;
}

export default POSTER_MAP;
