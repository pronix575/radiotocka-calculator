export type PriceList = PriceGroup[];

export type ProductionUnitFormValues = {
  amount: number;
  materialBase: string;
  material: string; // id
  cutting: string; // id
  print: string; // id
  height: string;
  width: string;
  patternedCuttingEnabled: boolean;
  patternedPerimeter: string;
  unit: MeasurementUnits;
};

export enum Unit {
  M = "m",
  M2 = "m2",
  M3 = "m3",
  Wage = "wage",
  Unit = "unit",
}

export interface PriceItem {
  id: string;
  name: string;
  price: number;
  unit: Unit;
  minCost?: number;
  lockId: string[];
  width?: number;
  height?: number;
}

export interface PriceGroup {
  groupName: string;
  items: PriceItem[];
}

export enum MeasurementUnits {
  m = "m",
  dm = "dm",
  cm = "cm",
  mm = "mm",
}
