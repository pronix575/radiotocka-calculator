export enum Unit {
  M = "m",
  M2 = "m2",
  M3 = "m3",
  Wage = "wage",
  Unit = "unit",
}

interface PriceItem {
  id: string;
  name: string;
  price: number;
  unit: Unit;
  minCost?: number;
}

interface PriceGroup {
  groupName: string;
  items: PriceItem[];
}

const mockPriceList: PriceGroup[] = [
  {
    groupName: "Материалы",
    items: [
      {
        id: "mat_001",
        name: "ПВХ 1мм",
        price: 540,
        unit: Unit.M2,
      },
      {
        id: "mat_002",
        name: "ПВХ 2мм",
        price: 610,
        unit: Unit.M2,
      },
      {
        id: "mat_003",
        name: "ПВХ 3мм",
        price: 830,
        unit: Unit.M2,
      },
    ],
  },
  {
    groupName: "Резка",
    items: [
      {
        id: "cut_001",
        name: "Резка ПВХ ножом",
        price: 15,
        unit: Unit.M,
      },
      {
        id: "cut_002",
        name: "Резка ПВХ фрезером",
        price: 25,
        unit: Unit.M,
        minCost: 1000,
      },
    ],
  },
  {
    groupName: "Печать",
    items: [
      {
        id: "print_001",
        name: "Печать на ПВХ",
        price: 700,
        unit: Unit.M2,
        minCost: 700,
      },
    ],
  },
];

export const getPriceList = async () => {
  const response = (await new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          ok: true,
          json: () => Promise.resolve(mockPriceList),
        } as Response),
      500,
    ),
  )) as Response;

  if (!response.ok) {
    throw new Error("Failed to fetch price list");
  }

  return response.json();
};
