import { api } from "./api";

export const getUsers = async () => {
  //console.log("[userService] BUSCANDO USUÁRIOS...");

  try {
    const response = await api.get("/users/");

    /*console.log(
      "[userService] USUÁRIOS RECEBIDOS:",
      response.data,
    );*/

    return response.data;
  } catch (error) {
    /*console.error(
      "[userService] ERRO AO BUSCAR USUÁRIOS:",
      error,
    );

    console.error(
      "[userService] RESPOSTA DA API:",
      error.response?.data,
    );

    throw error;*/
  }
};

export const getCurrentUser = async () => {
  //console.log("[userService] BUSCANDO USUÁRIO AUTENTICADO...");

  const response = await api.get("/auth/me/");

  /*console.log(
    "[userService] USUÁRIO AUTENTICADO RECEBIDO:",
    response.data,
  );*/

  return response.data;
};

export const registerUser = async (userData) => {
  /*console.log(
    "[userService] DADOS PARA CADASTRO:",
    userData,
  );*/

  try {
    const response = await api.post("/register/", userData);

    /*console.log(
      "[userService] USUÁRIO CADASTRADO:",
      response.data,
    );*/

    return response.data;
  } catch (error) {
    /*console.error(
      "[userService] ERRO AO CADASTRAR USUÁRIO:",
      error,
    );

    console.error(
      "[userService] RESPOSTA DA API:",
      error.response?.data,
    );

    throw error;*/
  }
};

export const resetUserPassword = async (
  userId,
  passwordData,
) => {
  /*console.log(
    "[userService] RESETANDO SENHA DO USUÁRIO:",
    userId,
  );*/

  try {
    const response = await api.post(
      `/admin/reset-password/${userId}/`,
      passwordData,
    );

    /*console.log(
      "[userService] SENHA REDEFINIDA:",
      response.data,
    );*/

    return response.data;
  } catch (error) {
    /*console.error(
      "[userService] ERRO AO RESETAR SENHA:",
      error,
    );

    console.error(
      "[userService] RESPOSTA DA API:",
      error.response?.data,
    );

    throw error;*/
  }
};

export const changePassword = async (passwordData) => {
  /*console.log(
    "[userService] ALTERANDO SENHA DO USUÁRIO LOGADO...",
  );*/

  try {
    const response = await api.post(
      "/change-password/",
      passwordData,
    );

    /*console.log(
      "[userService] SENHA ALTERADA:",
      response.data,
    );*/

    return response.data;
  } catch (error) {
    /*console.error(
      "[userService] ERRO AO ALTERAR SENHA:",
      error,
    );*/

    /*console.error(
      "[userService] RESPOSTA DA API:",
      error.response?.data,
    );

    throw error;*/
  }
};
