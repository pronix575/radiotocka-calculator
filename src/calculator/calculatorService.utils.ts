import {
  PriceItem,
  PriceList,
  ProductionUnitFormValues,
} from "./calculatorService.types";

export interface CalculationResult {
  totalArea: number;
  totalPerimeter: number;
  materialPrice: number;
  printPrice: number;
  cuttingPrice: number;
  totalPrice: number;
  materialCost: number;
  printCost: number;
  cuttingCost: number;
}

export const calculateResult = (
  formValues: ProductionUnitFormValues,
  priceList: PriceList,
): CalculationResult | null => {
  // Валидация входных данных
  const amount = Number(formValues.amount);
  const width = Number(formValues.width);
  const height = Number(formValues.height);

  if (!amount || !width || !height) return null;
  if (!formValues.material || !formValues.cutting || !formValues.print)
    return null;

  // Получаем цены из priceList
  let materialItem: PriceItem | null = null;
  let printItem: PriceItem | null = null;
  let cuttingItem: PriceItem | null = null;

  for (const group of priceList) {
    for (const item of group.items) {
      if (item.id === formValues.material) materialItem = item;
      if (item.id === formValues.print) printItem = item;
      if (item.id === formValues.cutting) cuttingItem = item;
    }
  }

  if (!materialItem || !printItem || !cuttingItem) return null;

  const materialPrice = materialItem.price;
  const printPrice = printItem.price;
  const cuttingPrice = cuttingItem.price;

  const adjustedWidth = width;
  const adjustedHeight = height;

  // Общая площадь
  let totalArea = amount * adjustedWidth * adjustedHeight;
  totalArea = Math.ceil(totalArea * 100) / 100;

  // Общий периметр
  const manualPerimeter = formValues.patternedCuttingEnabled
    ? Number(formValues.patternedPerimeter)
    : 0;
  const totalPerimeter =
    formValues.patternedCuttingEnabled && manualPerimeter > 0
      ? manualPerimeter * amount
      : Math.ceil(amount * ((width + height) * 2));

  // Цена по компонентам
  let materialCost = totalArea * materialPrice;
  let printCost = totalArea * printPrice;
  let cuttingCost = totalPerimeter * cuttingPrice;

  // Применяем минимальную стоимость для каждой услуги
  if (materialItem.minCost !== undefined)
    materialCost = Math.max(materialCost, materialItem.minCost);
  if (printItem.minCost !== undefined)
    printCost = Math.max(printCost, printItem.minCost);
  if (cuttingItem.minCost !== undefined)
    cuttingCost = Math.max(cuttingCost, cuttingItem.minCost);

  const totalPrice = materialCost + printCost + cuttingCost;

  return {
    totalArea,
    totalPerimeter,
    materialPrice,
    printPrice,
    cuttingPrice,
    totalPrice,
    printCost,
    cuttingCost,
    materialCost,
  };
};
