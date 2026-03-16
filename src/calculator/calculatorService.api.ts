import Papa from "papaparse";
import { PriceGroup, PriceItem, Unit } from "./calculatorService.types";

const DEFAULT_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1hHzLdhoqzpCqOJ15imFSSnJKyxIvD47ASbMAtDsr95w/export?format=csv&gid=0";
const SHEET_URL_QUERY_PARAM = "sheetUrl";

const getSheetUrlFromLocation = (): string => {
  if (typeof window === "undefined") {
    return DEFAULT_SHEET_URL;
  }

  const sheetUrl = new URLSearchParams(window.location.search).get(
    SHEET_URL_QUERY_PARAM,
  );

  if (!sheetUrl) {
    return DEFAULT_SHEET_URL;
  }

  return normalizeSheetUrl(sheetUrl);
};

const normalizeSheetUrl = (rawUrl: string): string => {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    throw new Error("Invalid sheetUrl parameter");
  }

  if (parsedUrl.hostname !== "docs.google.com") {
    return parsedUrl.toString();
  }

  const spreadsheetMatch = parsedUrl.pathname.match(
    /^\/spreadsheets\/d\/([^/]+)/,
  );

  if (!spreadsheetMatch) {
    return parsedUrl.toString();
  }

  const sheetId = spreadsheetMatch[1];
  const gidFromHash = parsedUrl.hash.match(/gid=(\d+)/)?.[1];
  const gid = parsedUrl.searchParams.get("gid") ?? gidFromHash ?? "0";

  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
};

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

const parseOptionalNumber = (value: unknown): number | undefined => {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseOptionalBoolean = (value: unknown): boolean | undefined => {
  if (value === null || value === undefined || value === "") return undefined;

  const normalizedValue = String(value).trim().toLowerCase();

  if (["true", "1", "yes", "y"].includes(normalizedValue)) return true;
  if (["false", "0", "no", "n"].includes(normalizedValue)) return false;

  return undefined;
};

export const getPriceList = async (): Promise<PriceGroup[]> => {
  const response = await fetch(getSheetUrlFromLocation());

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

    const width = parseOptionalNumber(row.width);
    const height = parseOptionalNumber(row.height);
    const hideCut = parseOptionalBoolean(row.hideCut);

    const item: PriceItem = {
      id: row.id,
      name: row.name,
      price: Number(row.price),
      unit: parseUnit(row.unit),
      lockId,
      ...(row.minCost ? { minCost: Number(row.minCost) } : {}),
      ...(hideCut !== undefined ? { hideCut } : {}),
      ...(width !== undefined ? { width } : {}),
      ...(height !== undefined ? { height } : {}),
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
