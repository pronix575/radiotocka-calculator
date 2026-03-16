import { Key } from "react";
import * as Flags from "country-flag-icons/react/3x2";

import { PhoneCountry } from "./CalculationResultPanel.constants";

export const getEmbedPageUrl = () => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return { pageUrl: "", siteHost: "" };
  }

  const currentOrigin = window.location.origin;
  const candidates = [
    document.referrer,
    ...Array.from(window.location.ancestorOrigins || []),
  ].filter(Boolean);

  try {
    if (window.top && window.top !== window) {
      candidates.push(window.top.location.href);
    }
  } catch {
    // Ignore cross-origin access errors and continue with safe fallbacks.
  }

  const externalUrl =
    candidates.find((candidate) => {
      try {
        return new URL(candidate).origin !== currentOrigin;
      } catch {
        return false;
      }
    }) || document.referrer;

  const pageUrl = externalUrl || window.location.href;

  try {
    return {
      pageUrl,
      siteHost: new URL(pageUrl).hostname,
    };
  } catch {
    return {
      pageUrl,
      siteHost: "",
    };
  }
};

export const getSelectedCountryCode = (keys: "all" | Set<Key>) => {
  if (keys === "all") {
    return null;
  }

  const firstKey = keys.values().next().value;

  return firstKey ? String(firstKey) : null;
};

export const validateSelectedFiles = (
  files: File[],
  maxFiles: number,
  maxFileSize: number,
) => {
  if (files.length > maxFiles) {
    return `Можно прикрепить не более ${maxFiles} файлов.`;
  }

  const tooLarge = files.find((file) => file.size > maxFileSize);

  if (tooLarge) {
    return "Размер каждого файла должен быть до 10 МБ.";
  }

  return null;
};

export const normalizePhone = (value: string, country: PhoneCountry) => {
  let digits = value.replace(/\D/g, "");

  if (
    ["RU", "KZ"].includes(country.code) &&
    digits.length > country.maxDigits &&
    digits.startsWith("8")
  ) {
    digits = digits.slice(1);
  }

  if (
    digits.length > country.maxDigits &&
    digits.startsWith(country.dialCode)
  ) {
    digits = digits.slice(country.dialCode.length);
  }

  if (digits.length > country.maxDigits) {
    digits = digits.slice(0, country.maxDigits);
  }

  return digits;
};

export const formatPhone = (value: string, country: PhoneCountry) => {
  const digits = normalizePhone(value, country);
  const parts: string[] = [];
  let offset = 0;

  if (country.groups?.length) {
    country.groups.forEach((groupSize) => {
      const part = digits.slice(offset, offset + groupSize);
      if (part) {
        parts.push(part);
        offset += groupSize;
      }
    });
  }

  if (offset < digits.length) {
    parts.push(digits.slice(offset));
  }

  return parts.join(" ");
};

export const CountryFlag = ({ countryCode }: { countryCode: string }) => {
  const FlagComponent = Flags[countryCode as keyof typeof Flags] as
    | React.ComponentType<React.SVGProps<SVGSVGElement>>
    | undefined;

  if (!FlagComponent) {
    return (
      <span className="inline-flex h-[14px] w-[20px] items-center justify-center rounded-[2px] border border-gray-200 bg-gray-100 text-[9px] font-semibold text-gray-500">
        {countryCode}
      </span>
    );
  }

  return (
    <FlagComponent className="h-[14px] w-[20px] rounded-[2px] border border-gray-200 object-cover" />
  );
};
