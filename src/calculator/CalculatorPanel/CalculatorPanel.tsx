import { FC } from "react";

import { CalculatorPanelProps } from "./CalculatorPanel.types";
import { ProductionUnitForm } from "./ProductionUnitForm";

export const CalculatorPanel: FC<CalculatorPanelProps> = ({ priceList }) => {
  return (
    <div>
      <ProductionUnitForm priceList={priceList} />
    </div>
  );
};
