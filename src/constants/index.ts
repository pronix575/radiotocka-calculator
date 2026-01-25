import { Unit } from "@/calculator/calculatorService.api";

export const UnitTranslations: { [key in Unit]: string } = {
  [Unit.M]: "м",
  [Unit.M2]: "м²",
  [Unit.M3]: "м³",
  [Unit.Unit]: "шт.",
  [Unit.Wage]: "ч/ч",
};
