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
export const SITE_URL = "www.9v.ru";

export const PERSONAL_DATA_OPERATOR = {
  name: "ИП Вагизов Алмаз Фаридович",
  email: "copy@9v.ru",
  address:
    "427740, Удмуртская Республика, р-н Граховский, д. Яги-Какси, ул. Октябрьская, д. 43",
  phone: "8 (843) 525-00-00",
};

export const PERSONAL_DATA_POLICY_SECTIONS = [
  {
    title: "Публичная оферта",
    paragraphs: [
      "Настоящий документ - это публичная оферта (предложение) интернет-магазина «РадиоТочка» о продаже товаров.",
    ],
  },
  {
    title: "1. Общие положения",
    paragraphs: [
      "1.1. Настоящая публичная оферта является официальным предложением ИП Вагизова Алсу Рафкатовна в адрес любого физического лица заключить договор розничной купли-продажи товара на Сайте дистанционным образом на условиях, определенных в настоящем Договоре, и содержит все существенные условия Оферты.",
      "1.2. Заказ Покупателем товара, размещенного на Сайте, означает, что Покупатель согласен со всеми условиями настоящей Оферты, Политики конфиденциальности и Пользовательского соглашения.",
      "1.3. Сайт имеет право вносить изменения в Оферту без уведомления Покупателя.",
      "1.4. Срок действия Оферты не ограничен, если иное не указано на Сайте.",
      "1.5. Сайт предоставляет Покупателю полную и достоверную информацию о товаре и услугах, включая информацию об основных потребительских свойствах товара.",
    ],
  },
  {
    title: "2. Предмет Оферты",
    paragraphs: [
      "2.1. Сайт обязуется передать Покупателю товар, предназначенный для личного, семейного, домашнего или иного использования, не связанного с предпринимательской деятельностью, на основании размещенных заказов, а Покупатель обязуется принять и оплатить товар на условиях настоящей Оферты.",
      "2.2. Наименование, цена, количество товара, а также прочие необходимые условия Оферты определяются на основании сведений, предоставленных Покупателем при оформлении заказа.",
      "2.3. Право собственности на заказанные товары переходит к Покупателю с момента фактической передачи товара Покупателю и оплаты последним полной стоимости товара. Риск случайной гибели или повреждения товара переходит к Покупателю с момента фактической передачи товара.",
    ],
  },
  {
    title: "3. Стоимость товара и услуг",
    paragraphs: [
      `3.1. Цены на товар определяются Продавцом в одностороннем бесспорном порядке и указываются на страницах интернет-магазина по адресу ${SITE_URL}.`,
      "3.2. Цена товара указывается в рублях Российской Федерации и включает в себя налог на добавленную стоимость.",
      "3.3. Окончательная цена товара определяется последовательным действием на цену товара скидок по следующему порядку: акционная скидка, скидка по промокоду, скидка постоянного Покупателя.",
      "3.4. Расчеты между Сайтом и Покупателем за товар производятся способами, указанными на Сайте в разделе «Оплата».",
    ],
  },
  {
    title: "4. Момент заключения Оферты",
    paragraphs: [
      "4.1. Акцептом настоящей Оферты является оформление Покупателем заказа на товар в соответствии с условиями настоящей Оферты. Оформление заказа производится путем совершения действий, указанных в разделе оформления заказа.",
      "4.2. Акцептируя настоящую Оферту, Покупатель выражает согласие в том, что регистрационные данные, в том числе персональные данные, указаны им добровольно и передаются в электронной форме по каналам связи сети Интернет.",
      "4.3. Покупатель соглашается, что регистрационные данные переданы Сайту для реализации целей, указанных в настоящей Оферте, Политике конфиденциальности и Пользовательском соглашении, и могут быть переданы третьим лицам для реализации этих целей.",
      "4.4. Регистрационные данные могут использоваться Сайтом в целях продвижения товаров и услуг путем осуществления прямых контактов с Покупателем с помощью каналов связи.",
      "4.5. В целях дополнительной защиты от мошеннических действий регистрационные данные могут быть переданы банку, осуществляющему транзакции по оплате оформленных заказов.",
      "4.6. Согласие Покупателя на обработку регистрационных данных является бессрочным и может быть отозвано Покупателем или его законным представителем путем подачи письменного заявления, переданного Сайту.",
    ],
  },
  {
    title: "5. Возврат товара и денежных средств",
    paragraphs: [
      "5.1. Возврат товара осуществляется в соответствии с Законом РФ «О защите прав потребителей».",
      "5.2. Возврат денежных средств осуществляется посредством возврата стоимости оплаченного товара на банковскую карту или почтовым переводом.",
    ],
  },
  {
    title: "6. Доставка товара",
    paragraphs: [
      "6.1. Доставка товара Покупателю осуществляется в сроки, согласованные Сторонами при подтверждении заказа сотрудником Сайта.",
      "6.2. При курьерской доставке товара Покупатель в реестре доставки ставит свою подпись напротив тех позиций товара, которые он приобрел. Эта подпись служит подтверждением того, что Покупатель не имеет претензий к комплектации товара, количеству и внешнему виду товара.",
      "6.3. После получения товара претензии к количеству, комплектности и виду товара не принимаются.",
    ],
  },
  {
    title: "7. Срок действия Оферты",
    paragraphs: [
      "7.1. Настоящая Оферта вступает в силу с момента ее акцепта Покупателем и действует до момента отзыва акцепта публичной Оферты.",
    ],
  },
  {
    title: "8. Дополнительные условия",
    paragraphs: [
      "8.1. Сайт вправе переуступать либо иным способом передавать свои права и обязанности, вытекающие из его отношений с Покупателем, третьим лицам.",
      "8.2. Сайт и предоставляемые сервисы могут временно частично или полностью недоступны по причине проведения профилактических или иных работ либо по любым другим причинам технического характера. Техническая служба Сайта имеет право периодически проводить необходимые профилактические или иные работы с предварительным уведомлением Покупателей или без такового.",
      "8.3. К отношениям между Покупателем и Сайтом применяются положения законодательства Российской Федерации.",
      "8.4. В случае возникновения вопросов и претензий со стороны Покупателя он должен обратиться к Сайту по телефону или иным доступным способом. Все возникающие споры стороны будут стремиться решить путем переговоров, а при недостижении соглашения спор передается на рассмотрение в судебный орган в соответствии с действующим законодательством РФ.",
      "8.5. Признание судом недействительности какого-либо положения настоящего Соглашения не влечет за собой недействительность остальных положений.",
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
