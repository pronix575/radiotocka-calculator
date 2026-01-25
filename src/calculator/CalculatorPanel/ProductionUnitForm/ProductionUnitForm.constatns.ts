import * as yup from "yup";

export const validationSchema = yup.object({
  amount: yup
    .number()
    .typeError("Количество должно быть числом")
    .required("Количество обязательно")
    .integer("Количество должно быть целым числом")
    .min(1, "Количество должно быть больше 0"),

  width: yup
    .string()
    .required("Ширина обязательна")
    .test(
      "is-positive-number",
      "Ширина должна быть числом больше 0",
      (value) => {
        if (!value) return false; // пустая строка
        const numberValue = parseFloat(value.replace(",", "."));
        return !isNaN(numberValue) && numberValue > 0;
      },
    )
    .test("max-width", "Ширина не должна превышать 3 м", (value) => {
      if (!value) return true; // другая валидация уже обработает пустое
      const numberValue = parseFloat(value.replace(",", "."));
      return numberValue <= 3;
    }),

  height: yup
    .string()
    .required("Высота обязательна")
    .test(
      "is-positive-number",
      "Высота должна быть числом больше 0",
      (value) => {
        if (!value) return false;
        const numberValue = parseFloat(value.replace(",", "."));
        return !isNaN(numberValue) && numberValue > 0;
      },
    )
    .test("max-height", "Высота не должна превышать 2 м", (value) => {
      if (!value) return true;
      const numberValue = parseFloat(value.replace(",", "."));
      return numberValue <= 2;
    }),

  material: yup.string().required("Выберите материал"),
  cutting: yup.string().required("Выберите резку"),
  print: yup.string().required("Выберите печать"),
});
