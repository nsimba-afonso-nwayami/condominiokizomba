import { api } from "./api";
import { clearTokens } from "./authStorage";

export const login = async (credentials) => {
  const response = await api.post("/login/", credentials);

  /*console.log("RESPOSTA COMPLETA:", response);
  console.log("STATUS:", response.status);
  console.log("DADOS:", response.data);
  console.log("HEADERS:", response.headers);*/

  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post("/token/refresh/");
  return response.data;
};

export const logout = () => {
  clearTokens();
};
