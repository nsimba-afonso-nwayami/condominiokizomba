import axios from "axios";

import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "./authStorage";

// Produção
 const API_URL = "https://api.condominiokizomba.com/api/";

// Desenvolvimento
// const API_URL = "/api/";

const REQUEST_TIMEOUT = 15000;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
  timeout: REQUEST_TIMEOUT,
});

// Instância isolada, sem interceptors, dedicada só ao refresh.
// Evita duplicar config e garante que o refresh nunca passe
// pelo interceptor de request/response da `api` (o que poderia
// causar loops ou anexar um Authorization indevido).
const refreshApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // confirme se o refresh realmente depende de cookie
  timeout: REQUEST_TIMEOUT,
});

/* ============================
   Logout forçado (helper)
============================ */

function forceLogout() {
  clearTokens();

  // window.location.href força reload completo da SPA.
  // Se usarem React Router, considerem substituir por um evento:
  //   window.dispatchEvent(new CustomEvent("auth:logout"))
  // e ouvir esse evento no componente raiz para chamar navigate("/login").
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

/* ============================
   Interceptor de requisição
============================ */

api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* ============================
   Interceptor de resposta
============================ */

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Erro sem response (timeout, rede offline, CORS) — não há
    // como tentar refresh nesses casos.
    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Evita loop infinito
    if (originalRequest._retry) {
      forceLogout();
      return Promise.reject(error);
    }

    // Se o próprio refresh falhar (401 no endpoint de refresh)
    if (originalRequest.url?.includes("token/refresh")) {
      forceLogout();
      return Promise.reject(error);
    }

    // Se já existe um refresh em andamento, aguarda ele terminar
    // e reaproveita o novo token.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      isRefreshing = false;
      forceLogout();
      return Promise.reject(error);
    }

    try {
      const { data } = await refreshApi.post("token/refresh/", {
        refresh: refreshToken,
      });

      const newAccessToken = data.access;

      saveTokens({
        access: newAccessToken,
        refresh: data.refresh || refreshToken,
      });

      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
