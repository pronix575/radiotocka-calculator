import { CalculationResult } from "../../calculatorService.utils";

export interface CalculationInputSummary {
  amount: number;
  width: string;
  height: string;
  unit: string;
  material: string;
  cutting: string;
  print: string;
  patternedCuttingEnabled: boolean;
  patternedPerimeter: string;
}

export interface CalculationResultPanelProps {
  result: CalculationResult | null;
  inputSummary: CalculationInputSummary | null;
}
