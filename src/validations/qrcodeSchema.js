import * as yup from "yup";

export const qrcodeSchema = yup.object({
  morador: yup
    .string()
    .required("O nome do morador é obrigatório.")
    .min(3, "O nome do morador deve ter pelo menos 3 caracteres.")
    .max(100, "O nome do morador não pode ultrapassar 100 caracteres."),

  tipoEvento: yup
    .string()
    .required("Selecione o tipo de evento."),

  data: yup
    .string()
    .required("A data do evento é obrigatória."),

  hora: yup
    .string()
    .required("A hora de início é obrigatória."),

  horaFim: yup
    .string()
    .required("A hora de fim é obrigatória.")
    .test(
      "hora-maior",
      "A hora de fim deve ser posterior à hora de início.",
      function (horaFim) {
        const { hora } = this.parent;

        if (!hora || !horaFim) return true;

        return horaFim > hora;
      }
    ),

  local: yup
    .string()
    .required("Selecione o local do evento."),

  convidados: yup
    .string()
    .required("Informe pelo menos um convidado.")
    .min(3, "Informe um nome de convidado válido.")
    .max(1000, "A lista de convidados é muito longa."),
});
