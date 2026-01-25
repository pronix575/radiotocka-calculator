export enum Unit {
  M = "m",
  M2 = "m2",
  M3 = "m3",
  Wage = "wage",
  Unit = "unit",
}

const mockPriceList = [
  {
    groupName: "Материалы",
    items: [
      { id: "mat_001", name: "ПВХ 1мм", price: 100, unit: Unit.M2, minCost: 500 },
      { id: "mat_002", name: "ПВХ 2мм", price: 200, unit: Unit.M2, minCost: 800 },
      { id: "mat_003", name: "ПВХ 3мм", price: 300, unit: Unit.M2, minCost: 1200 },
    ],
  },
  {
    groupName: "Резка",
    items: [
      { id: "cut_001", name: "Резка ПВХ лазером", price: 50, unit: Unit.M, minCost: 300 },
      { id: "cut_002", name: "Резка ПВХ фрезером", price: 70, unit: Unit.M, minCost: 400 },
    ],
  },
  {
    groupName: "Печать",
    items: [{ id: "print_001", name: "Печать на ПВХ", price: 150, unit: Unit.M2, minCost: 700 }],
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
