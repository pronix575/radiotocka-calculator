import { MeasurementUnitsToCoefficient } from "@/calculator/calculatorService.constants";
import { MeasurementUnits } from "@/calculator/calculatorService.types";
import * as yup from "yup";

export const DEFAULT_MAX_WIDTH_M = 3;
export const DEFAULT_MAX_HEIGHT_M = 2;

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
    .test(
      "max-width",
      "Ширина не должна превышать допустимый максимум",
      (value, ctx) => {
        if (!value) return true; // другая валидация уже обработает пустое
        const unit: MeasurementUnits = ctx.options.context?.unit;

        const numberValue = parseFloat(value.replace(",", "."));

        const computedValue = MeasurementUnitsToCoefficient[unit] * numberValue;
        const maxWidth = ctx.options.context?.maxWidth ?? DEFAULT_MAX_WIDTH_M;

        if (isNaN(maxWidth)) return true;

        if (computedValue <= maxWidth) return true;

        return ctx.createError({
          message: `Ширина не должна превышать ${maxWidth} м`,
        });
      },
    ),

  height: yup
    .string()
    .required("Длина обязательна")
    .test(
      "is-positive-number",
      "Длина должна быть числом больше 0",
      (value, ctx) => {
        if (!value) return false;
        const unit: MeasurementUnits = ctx.options.context?.unit;
        const numberValue = parseFloat(value.replace(",", "."));
        const computedValue = MeasurementUnitsToCoefficient[unit] * numberValue;
        return !isNaN(computedValue) && computedValue > 0;
      },
    )
    .test(
      "max-height",
      "Длина не должна превышать допустимый максимум",
      (value, ctx) => {
        if (!value) return true;
        const unit: MeasurementUnits = ctx.options.context?.unit;
        const numberValue = parseFloat(value.replace(",", "."));
        const computedValue = MeasurementUnitsToCoefficient[unit] * numberValue;
        const maxHeight =
          ctx.options.context?.maxHeight ?? DEFAULT_MAX_HEIGHT_M;

        if (isNaN(maxHeight)) return true;

        if (computedValue <= maxHeight) return true;

        return ctx.createError({
          message: `Длина не должна превышать ${maxHeight} м`,
        });
      },
    ),

  material: yup.string().required("Выберите толщину"),
  materialBase: yup.string().required("Выберите материал"),
  cutting: yup.string().required("Выберите резку"),
  print: yup.string().required("Выберите печать"),
  patternedCuttingEnabled: yup.boolean().default(false),
  patternedPerimeter: yup.string().when("patternedCuttingEnabled", {
    is: true,
    then: (schema) =>
      schema
        .required("Периметр обязателен")
        .test(
          "is-positive-number",
          "Периметр должен быть числом больше 0",
          (value, ctx) => {
            if (!value) return false;
            const unit: MeasurementUnits = ctx.options.context?.unit;
            const numberValue = parseFloat(value.replace(",", "."));
            const computedValue =
              MeasurementUnitsToCoefficient[unit] * numberValue;
            return !isNaN(computedValue) && computedValue > 0;
          },
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
});
