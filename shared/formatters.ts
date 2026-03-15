const normalizeSpaces = (value: string) => value.replace(/[\u00A0\u202F]/g, " ");

type FormatNumberOptions = {
  maximumFractionDigits?: number;
  useGrouping?: boolean;
};

export const formatNumber = (
  value: number | string,
  options: FormatNumberOptions = {},
) => {
  const numericValue =
    typeof value === "number" ? value : Number(String(value).replace(",", "."));

  if (Number.isNaN(numericValue)) return String(value);

  const { maximumFractionDigits = 2, useGrouping = false } = options;

  return normalizeSpaces(
    new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits,
      useGrouping,
    }).format(numericValue),
  );
};

export const formatMoney = (value: number) =>
  formatNumber(value, { maximumFractionDigits: 2, useGrouping: true });
