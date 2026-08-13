import * as yup from "yup";

export const loginSchema = yup.object({
  username: yup
    .string()
    .required("O nome de usuário é obrigatório.")
    .min(3, "O nome de usuário deve ter pelo menos 3 caracteres.")
    .max(50, "O nome de usuário não pode ultrapassar 50 caracteres."),

  password: yup
    .string()
    .required("A palavra-passe é obrigatória.")
    .min(6, "A palavra-passe deve ter pelo menos 6 caracteres.")
    .max(100, "A palavra-passe não pode ultrapassar 100 caracteres."),
});
