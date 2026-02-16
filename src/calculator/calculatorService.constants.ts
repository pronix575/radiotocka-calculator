import { MeasurementUnits } from "./calculatorService.types";

export const MeasurementUnitsTranslate = {
  [MeasurementUnits.m]: "м",
  [MeasurementUnits.dm]: "дм",
  [MeasurementUnits.cm]: "см",
  [MeasurementUnits.mm]: "мм",
};

export const MeasurementUnitsToCoefficient: {
  [key in MeasurementUnits]: number;
} = {
  [MeasurementUnits.m]: 1,
  [MeasurementUnits.dm]: 0.1,
  [MeasurementUnits.cm]: 0.01,
  [MeasurementUnits.mm]: 0.001,
};
