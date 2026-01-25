import {
  PriceList,
  ProductionUnitFormValues,
} from "../../calculatorService.types";

export type ProductionUnitFormProps = {
  priceList: PriceList;
  setCalculatingResult: (result: ProductionUnitFormValues | null) => void;
};
