import { PriceList, ProductionUnitFormValues } from "./calculatorService.types";

export interface CalculationResult {
  totalArea: number;
  totalPerimeter: number;
  materialPrice: number;
  printPrice: number;
  cuttingPrice: number;
  totalPrice: number;
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
  let materialPrice = 0;
  let printPrice = 0;
  let cuttingPrice = 0;

  for (const group of priceList) {
    for (const item of group.items) {
      if (item.id === formValues.material) materialPrice = item.price;
      if (item.id === formValues.print) printPrice = item.price;
      if (item.id === formValues.cutting) cuttingPrice = item.price;
    }
  }

  // Расчеты
  const adjustedWidth = width + 0.03;
  const adjustedHeight = height + 0.03;

  // площадь общая = кол-во * ((ширина + 0.03) * (высота + 0.03))
  let totalArea = amount * adjustedWidth * adjustedHeight;

  // округляем вверх до сотых
  totalArea = Math.ceil(totalArea * 100) / 100;

  // периметр общий = кол-во * ((ширина + высота) * 2)
  const totalPerimeter = Math.ceil(amount * ((width + height) * 2));

  // цена общая = площадь общая * (цена материала + цена печати) + периметер общий * цена резки
  const totalPrice =
    totalArea * (materialPrice + printPrice) + totalPerimeter * cuttingPrice;

  return {
    totalArea,
    totalPerimeter,
    materialPrice,
    printPrice,
    cuttingPrice,
    totalPrice,
  };
};
