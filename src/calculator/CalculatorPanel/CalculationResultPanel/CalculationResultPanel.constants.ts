import countries from "i18n-iso-countries";
import ruLocale from "i18n-iso-countries/langs/ru.json";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";

countries.registerLocale(ruLocale);

export interface PhoneCountry {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  minDigits: number;
  maxDigits: number;
  groups?: number[];
}

interface PhoneCountryOverride {
  minDigits: number;
  maxDigits: number;
  groups?: number[];
}

export const SHOW_SEND = true; // Временно скрываем форму отправки, так как бэкенд еще не готов

export const MAX_FILES = 5;
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const PERSONAL_DATA_OPERATOR = {
  name: "ИП Вагизов Алмаз Фаридович",
  email: "copy@9v.ru",
  address:
    "427740, Удмуртская Республика, р-н Граховский, д. Яги-Какси, ул. Октябрьская, д. 43",
  phone: "8 (843) 525-00-00",
};

export const PERSONAL_DATA_POLICY_SECTIONS = [
  {
    title: "1. Общие положения",
    paragraphs: [
      `Настоящая политика применяется к персональным данным, которые пользователь предоставляет при отправке расчета через форму на сайте ${PERSONAL_DATA_OPERATOR.name}.`,
      `Оператор персональных данных: ${PERSONAL_DATA_OPERATOR.name}, email: ${PERSONAL_DATA_OPERATOR.email}, адрес: ${PERSONAL_DATA_OPERATOR.address}, тел.: ${PERSONAL_DATA_OPERATOR.phone}.`,
      "Оператор обрабатывает персональные данные в соответствии с законодательством Российской Федерации и только в объеме, необходимом для обработки обращения пользователя.",
    ],
  },
  {
    title: "2. Состав персональных данных",
    paragraphs: [
      "Оператор может обрабатывать имя или наименование компании, номер телефона, адрес электронной почты, текст комментария и прикрепленные пользователем файлы.",
      "Сведения из формы расчета используются только в связке с обращением пользователя и необходимы для подготовки ответа.",
    ],
  },
  {
    title: "3. Цели обработки",
    paragraphs: [
      "Подготовка и отправка расчета, обратная связь с пользователем, уточнение деталей запроса, обработка приложенных материалов и ведение переписки по обращению.",
    ],
  },
  {
    title: "4. Правовые основания",
    paragraphs: [
      "Основанием обработки является согласие пользователя, выраженное путем проставления чекбокса перед отправкой формы.",
    ],
  },
  {
    title: "5. Условия обработки и хранения",
    paragraphs: [
      "Персональные данные обрабатываются с использованием средств автоматизации и без них, с применением необходимых организационных и технических мер защиты.",
      "Данные хранятся не дольше, чем это требуется для обработки обращения и дальнейшего взаимодействия по нему, если иной срок не предусмотрен законодательством Российской Федерации.",
    ],
  },
  {
    title: "6. Права пользователя",
    paragraphs: [
      `Пользователь вправе запросить уточнение, обновление, блокирование или удаление своих персональных данных, а также отозвать согласие на их обработку, направив обращение оператору по адресу ${PERSONAL_DATA_OPERATOR.email} или по адресу: ${PERSONAL_DATA_OPERATOR.address}.`,
    ],
  },
];

const CIS_PRIORITY_CODES = [
  "RU",
  "BY",
  "KZ",
  "AZ",
  "AM",
  "KG",
  "MD",
  "TJ",
  "TM",
  "UZ",
] as const;

const PHONE_COUNTRY_OVERRIDES: Record<string, PhoneCountryOverride> = {
  RU: { minDigits: 10, maxDigits: 10, groups: [3, 3, 2, 2] },
  BY: { minDigits: 9, maxDigits: 9, groups: [2, 3, 2, 2] },
  KZ: { minDigits: 10, maxDigits: 10, groups: [3, 3, 2, 2] },
  AZ: { minDigits: 9, maxDigits: 9, groups: [2, 3, 2, 2] },
  AM: { minDigits: 8, maxDigits: 8, groups: [2, 3, 3] },
  KG: { minDigits: 9, maxDigits: 9, groups: [3, 3, 3] },
  MD: { minDigits: 8, maxDigits: 8, groups: [2, 3, 3] },
  TJ: { minDigits: 9, maxDigits: 9, groups: [2, 3, 2, 2] },
  TM: { minDigits: 8, maxDigits: 8, groups: [2, 3, 3] },
  UZ: { minDigits: 9, maxDigits: 9, groups: [2, 3, 2, 2] },
  AU: { minDigits: 9, maxDigits: 9, groups: [3, 3, 3] },
  AT: { minDigits: 7, maxDigits: 13 },
  AL: { minDigits: 8, maxDigits: 9 },
  DZ: { minDigits: 8, maxDigits: 9 },
  AR: { minDigits: 10, maxDigits: 10, groups: [3, 3, 4] },
  BE: { minDigits: 8, maxDigits: 9 },
  BG: { minDigits: 8, maxDigits: 9 },
  BR: { minDigits: 10, maxDigits: 11, groups: [2, 5, 4] },
  GB: { minDigits: 10, maxDigits: 10, groups: [4, 3, 3] },
  HU: { minDigits: 8, maxDigits: 9 },
  VN: { minDigits: 9, maxDigits: 10 },
  DE: { minDigits: 10, maxDigits: 11 },
  GR: { minDigits: 10, maxDigits: 10, groups: [3, 3, 4] },
  GE: { minDigits: 9, maxDigits: 9, groups: [3, 3, 3] },
  DK: { minDigits: 8, maxDigits: 8, groups: [2, 2, 2, 2] },
  EG: { minDigits: 10, maxDigits: 10, groups: [3, 3, 4] },
  IL: { minDigits: 8, maxDigits: 9 },
  IN: { minDigits: 10, maxDigits: 10, groups: [5, 5] },
  ID: { minDigits: 9, maxDigits: 11 },
  IE: { minDigits: 9, maxDigits: 9, groups: [2, 3, 4] },
  ES: { minDigits: 9, maxDigits: 9, groups: [3, 3, 3] },
  IT: { minDigits: 9, maxDigits: 10 },
  CA: { minDigits: 10, maxDigits: 10, groups: [3, 3, 4] },
  CY: { minDigits: 8, maxDigits: 8, groups: [2, 3, 3] },
  CN: { minDigits: 11, maxDigits: 11, groups: [3, 4, 4] },
  LV: { minDigits: 8, maxDigits: 8, groups: [2, 3, 3] },
  LT: { minDigits: 8, maxDigits: 8, groups: [3, 2, 3] },
  MY: { minDigits: 9, maxDigits: 10 },
  MX: { minDigits: 10, maxDigits: 10, groups: [2, 4, 4] },
  AE: { minDigits: 9, maxDigits: 9, groups: [2, 3, 4] },
  NO: { minDigits: 8, maxDigits: 8, groups: [3, 2, 3] },
  PL: { minDigits: 9, maxDigits: 9, groups: [3, 3, 3] },
  PT: { minDigits: 9, maxDigits: 9, groups: [3, 3, 3] },
  RO: { minDigits: 9, maxDigits: 9, groups: [3, 3, 3] },
  RS: { minDigits: 8, maxDigits: 9 },
  SG: { minDigits: 8, maxDigits: 8, groups: [4, 4] },
  SK: { minDigits: 9, maxDigits: 9, groups: [3, 3, 3] },
  SI: { minDigits: 8, maxDigits: 8, groups: [2, 3, 3] },
  US: { minDigits: 10, maxDigits: 10, groups: [3, 3, 4] },
  TH: { minDigits: 9, maxDigits: 9, groups: [2, 3, 4] },
  TR: { minDigits: 10, maxDigits: 10, groups: [3, 3, 4] },
  FI: { minDigits: 9, maxDigits: 10 },
  FR: { minDigits: 9, maxDigits: 9, groups: [1, 2, 2, 2, 2] },
  HR: { minDigits: 8, maxDigits: 9 },
  ME: { minDigits: 8, maxDigits: 8, groups: [2, 3, 3] },
  CZ: { minDigits: 9, maxDigits: 9, groups: [3, 3, 3] },
  CH: { minDigits: 9, maxDigits: 9, groups: [2, 3, 2, 2] },
  SE: { minDigits: 9, maxDigits: 9, groups: [2, 3, 2, 2] },
  EE: { minDigits: 7, maxDigits: 8 },
  ZA: { minDigits: 9, maxDigits: 9, groups: [2, 3, 4] },
  KR: { minDigits: 9, maxDigits: 10 },
  JP: { minDigits: 10, maxDigits: 10, groups: [2, 4, 4] },
};

const DEFAULT_PHONE_COUNTRY_OVERRIDE: PhoneCountryOverride = {
  minDigits: 6,
  maxDigits: 14,
};

const getFlagEmoji = (countryCode: string) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

const buildPhoneCountries = (): PhoneCountry[] =>
  getCountries()
    .filter((countryCode) => countryCode !== "UA")
    .reduce<PhoneCountry[]>((countriesList, countryCode) => {
      const name = countries.getName(countryCode, "ru");

      if (!name) {
        return countriesList;
      }

      const override =
        PHONE_COUNTRY_OVERRIDES[countryCode] ?? DEFAULT_PHONE_COUNTRY_OVERRIDE;

      countriesList.push({
        code: countryCode,
        name,
        dialCode: getCountryCallingCode(countryCode),
        flag: getFlagEmoji(countryCode),
        ...override,
      });

      return countriesList;
    }, []);

export const PHONE_COUNTRIES = buildPhoneCountries();

export const PHONE_COUNTRIES_BY_CODE = new Map(
  PHONE_COUNTRIES.map((country) => [country.code, country]),
);

export const SORTED_PHONE_COUNTRIES = [...PHONE_COUNTRIES].sort(
  (left, right) => {
    const leftPriority = CIS_PRIORITY_CODES.indexOf(
      left.code as (typeof CIS_PRIORITY_CODES)[number],
    );
    const rightPriority = CIS_PRIORITY_CODES.indexOf(
      right.code as (typeof CIS_PRIORITY_CODES)[number],
    );

    if (leftPriority !== -1 || rightPriority !== -1) {
      if (leftPriority === -1) return 1;
      if (rightPriority === -1) return -1;
      return leftPriority - rightPriority;
    }

    return left.name.localeCompare(right.name, "ru");
  },
);
