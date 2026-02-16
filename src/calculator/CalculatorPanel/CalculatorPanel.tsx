import { FC, useMemo, useState } from "react";

import { ProductionUnitFormValues } from "../calculatorService.types";
import { calculateResult, CalculationResult } from "../calculatorService.utils";

import { CalculatorPanelProps } from "./CalculatorPanel.types";
import { ProductionUnitForm } from "./ProductionUnitForm";
import { CalculationResultPanel } from "./CalculationResultPanel";

export const CalculatorPanel: FC<CalculatorPanelProps> = ({ priceList }) => {
  const [formValues, setFormValues] = useState<ProductionUnitFormValues | null>(
    null,
  );

  const reset = () => setFormValues(null);

  const calculationResult: CalculationResult | null = useMemo(() => {
    if (!formValues) return null;

    return calculateResult(formValues, priceList);
  }, [formValues, priceList]);

  return (
    <div className="flex flex-col justify-center p-6 max-w-6xl mx-auto gap-4 md:flex-row md:gap-x-4">
      <div className="w-full md:flex-1">
        <ProductionUnitForm
          priceList={priceList}
          setCalculatingResult={setFormValues}
          reset={reset}
        />
      </div>
      <div className="w-full md:w-80">
        <CalculationResultPanel result={calculationResult} />
      </div>
    </div>
  );
};
