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
//const API_URL = "/api/";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

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

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Se não for 401, devolve o erro normalmente
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Evita loop infinito
    if (originalRequest._retry) {
      clearTokens();
      window.location.href = "/login";

      return Promise.reject(error);
    }

    // Se o próprio refresh falhar
    if (originalRequest.url?.includes("token/refresh")) {
      clearTokens();
      window.location.href = "/login";

      return Promise.reject(error);
    }

    // Se já existe um refresh acontecendo,
    // espera ele terminar
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return api(originalRequest);
        })
        .catch((error) => Promise.reject(error));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = getRefreshToken();

    // Não existe refresh token
    if (!refreshToken) {
      clearTokens();
      window.location.href = "/login";

      return Promise.reject(error);
    }

    try {
      // IMPORTANTE:
      // API_URL já termina com /
      const response = await axios.post(
        `${API_URL}token/refresh/`,
        {
          refresh: refreshToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      const newAccessToken = response.data.access;

      // Guarda o novo access token
      saveTokens({
        access: newAccessToken,
        refresh: response.data.refresh || refreshToken,
      });

      // Libera as requisições que estavam aguardando
      processQueue(null, newAccessToken);

      // Atualiza a requisição original
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // Repete a requisição
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      clearTokens();

      window.location.href = "/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
