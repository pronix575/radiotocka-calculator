import { PriceGroup, PriceItem, Unit } from "./calculatorService.types";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1hHzLdhoqzpCqOJ15imFSSnJKyxIvD47ASbMAtDsr95w/export?format=csv&gid=0";

const parseUnit = (unit: string): Unit => {
  switch (unit) {
    case "m":
      return Unit.M;
    case "m2":
      return Unit.M2;
    case "m3":
      return Unit.M3;
    case "wage":
      return Unit.Wage;
    case "unit":
      return Unit.Unit;
    default:
      throw new Error(`Unknown unit: ${unit}`);
  }
};

export const getPriceList = async (): Promise<PriceGroup[]> => {
  const response = await fetch(SHEET_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch price list");
  }

  const csv = await response.text();

  const rows = csv
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => row.split(","));

  const [header, ...data] = rows;

  const groupIndex = header.indexOf("groupName");
  const idIndex = header.indexOf("id");
  const nameIndex = header.indexOf("name");
  const priceIndex = header.indexOf("price");
  const unitIndex = header.indexOf("unit");
  const minCostIndex = header.indexOf("minCost");

  const groups: Record<string, PriceGroup> = {};

  data.forEach((row) => {
    const groupName = row[groupIndex];

    const item: PriceItem = {
      id: row[idIndex],
      name: row[nameIndex],
      price: Number(row[priceIndex]),
      unit: parseUnit(row[unitIndex]),
      ...(row[minCostIndex] ? { minCost: Number(row[minCostIndex]) } : {}),
    };

    if (!groups[groupName]) {
      groups[groupName] = {
        groupName,
        items: [],
      };
    }

    groups[groupName].items.push(item);
  });

  return Object.values(groups);
};
