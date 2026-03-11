import Papa from "papaparse";
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

  const { data } = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
  });

  const groups: Record<string, PriceGroup> = {};

  (data as any[]).forEach((row) => {
    const groupName = row.groupName;

    const lockId =
      row.lockId?.length > 0
        ? row.lockId.split(",").map((id: string) => id.trim())
        : [];

    const item: PriceItem = {
      id: row.id,
      name: row.name,
      price: Number(row.price),
      unit: parseUnit(row.unit),
      lockId,
      ...(row.minCost ? { minCost: Number(row.minCost) } : {}),
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
