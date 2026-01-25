export interface PriceItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  minCost?: number;
}

export interface PriceGroup {
  groupName: string;
  items: PriceItem[];
}

export type PriceList = PriceGroup[];

export type ProductionUnitFormValues = {
  amount: number;
  material: string; // id
  cutting: string; // id
  print: string; // id
  height: string;
  width: string;
};
