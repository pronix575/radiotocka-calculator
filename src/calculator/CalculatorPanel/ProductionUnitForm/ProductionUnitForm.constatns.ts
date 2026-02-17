import { MeasurementUnitsToCoefficient } from "@/calculator/calculatorService.constants";
import { MeasurementUnits } from "@/calculator/calculatorService.types";
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
      (value, ctx) => {
        if (!value) return false; // пустая строка
        const unit: MeasurementUnits = ctx.options.context?.unit;
        const numberValue = parseFloat(value.replace(",", "."));

        const computedValue = MeasurementUnitsToCoefficient[unit] * numberValue;

        return !isNaN(computedValue) && computedValue > 0;
      },
    )
    .test("max-width", "Ширина не должна превышать 3 м", (value, ctx) => {
      if (!value) return true; // другая валидация уже обработает пустое
      const unit: MeasurementUnits = ctx.options.context?.unit;

      const numberValue = parseFloat(value.replace(",", "."));

      const computedValue = MeasurementUnitsToCoefficient[unit] * numberValue;
      return computedValue <= 3;
    }),

  height: yup
    .string()
    .required("Высота обязательна")
    .test(
      "is-positive-number",
      "Высота должна быть числом больше 0",
      (value, ctx) => {
        if (!value) return false;
        const unit: MeasurementUnits = ctx.options.context?.unit;
        const numberValue = parseFloat(value.replace(",", "."));
        const computedValue = MeasurementUnitsToCoefficient[unit] * numberValue;
        return !isNaN(computedValue) && computedValue > 0;
      },
    )
    .test("max-height", "Высота не должна превышать 2 м", (value, ctx) => {
      if (!value) return true;
      const unit: MeasurementUnits = ctx.options.context?.unit;
      const numberValue = parseFloat(value.replace(",", "."));
      const computedValue = MeasurementUnitsToCoefficient[unit] * numberValue;
      return computedValue <= 2;
    }),

  material: yup.string().required("Выберите материал"),
  cutting: yup.string().required("Выберите резку"),
  print: yup.string().required("Выберите печать"),
});
