import { FC, useMemo, useState } from "react";

import { CalculatorPanelProps } from "./CalculatorPanel.types";
import { ProductionUnitForm } from "./ProductionUnitForm";
import { CalculationResultPanel } from "./CalculationResultPanel";
import { ProductionUnitFormValues } from "../calculatorService.types";
import { calculateResult, CalculationResult } from "../calculatorService.utils";

export const CalculatorPanel: FC<CalculatorPanelProps> = ({ priceList }) => {
  const [formValues, setFormValues] = useState<ProductionUnitFormValues | null>(
    null,
  );

  const calculationResult: CalculationResult | null = useMemo(() => {
    if (!formValues) return null;
    return calculateResult(formValues, priceList);
  }, [formValues, priceList]);

  return (
    <div className="flex justify-center p-6 max-w-6xl mx-auto gap-x-4">
      <div className="flex-1">
        <ProductionUnitForm
          priceList={priceList}
          setCalculatingResult={setFormValues}
        />
      </div>
      <div className="w-80">
        <CalculationResultPanel result={calculationResult} />
      </div>
    </div>
  );
};
