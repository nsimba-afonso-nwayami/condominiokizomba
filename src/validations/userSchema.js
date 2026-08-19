import * as yup from "yup";

export const userSchema = yup.object({
  username: yup
    .string()
    .required("O nome de usuário é obrigatório.")
    .min(3, "O nome de usuário deve ter pelo menos 3 caracteres.")
    .max(150, "O nome de usuário deve ter no máximo 150 caracteres."),

  email: yup
    .string()
    .required("O email é obrigatório.")
    .email("Informe um email válido."),

  password: yup
    .string()
    .required("A senha é obrigatória.")
    .min(8, "A senha deve ter pelo menos 8 caracteres."),

  first_name: yup
    .string()
    .required("O primeiro nome é obrigatório."),

  last_name: yup
    .string()
    .required("O apelido é obrigatório."),
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required("A nova senha é obrigatória.")
    .min(6, "A senha deve ter pelo menos 6 caracteres."),

  confirmPassword: yup
    .string()
    .required("Confirme a nova senha.")
    .oneOf([yup.ref("password")], "As senhas não coincidem."),
});

export const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required("A senha atual é obrigatória."),

  newPassword: yup
    .string()
    .required("A nova senha é obrigatória.")
    .min(
      6,
      "A nova senha deve ter pelo menos 6 caracteres.",
    ),

  confirmPassword: yup
    .string()
    .required("Confirme a nova senha.")
    .oneOf(
      [yup.ref("newPassword")],
      "As senhas não coincidem.",
    ),
});
