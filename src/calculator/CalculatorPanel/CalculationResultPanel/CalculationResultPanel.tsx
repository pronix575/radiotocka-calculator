import {
  ChangeEvent,
  FC,
  FormEvent,
  Key,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { Tooltip } from "@heroui/tooltip";
import { QuestionCircleFill } from "react-bootstrap-icons";

import { CalculationResult } from "../../calculatorService.utils";
import {
  MAX_FILES,
  MAX_FILE_SIZE,
  PERSONAL_DATA_POLICY_SECTIONS,
  PHONE_COUNTRIES,
  PHONE_COUNTRIES_BY_CODE,
  PhoneCountry,
  SHOW_SEND,
  SORTED_PHONE_COUNTRIES,
} from "./CalculationResultPanel.constants";
import { formatMoney, formatNumber } from "../../../../shared/formatters";

interface CalculationInputSummary {
  amount: number;
  width: string;
  height: string;
  unit: string;
  material: string;
  cutting: string;
  print: string;
  patternedCuttingEnabled: boolean;
  patternedPerimeter: string;
}

interface CalculationResultPanelProps {
  result: CalculationResult | null;
  inputSummary: CalculationInputSummary | null;
}

const getEmbedPageUrl = () => {
  if (typeof document === "undefined") {
    return "";
  }

  return document.referrer || window.location.href;
};

const getCountryFlagUrl = (countryCode: string) =>
  `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;

const getSelectedCountryCode = (keys: "all" | Set<Key>) => {
  if (keys === "all") {
    return null;
  }

  const firstKey = keys.values().next().value;

  return firstKey ? String(firstKey) : null;
};

export const CalculationResultPanel: FC<CalculationResultPanelProps> = ({
  result,
  inputSummary,
}) => {
  const [isAreaTooltipOpen, setIsAreaTooltipOpen] = useState(false);
  const areaTooltipButtonRef = useRef<HTMLButtonElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("RU");
  const [clientEmail, setClientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isPolicyAccepted, setIsPolicyAccepted] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const onFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selected = Array.from(event.target.files ?? []);

    if (selected.length > MAX_FILES) {
      setError(`Можно прикрепить не более ${MAX_FILES} файлов.`);
      return;
    }

    const tooLarge = selected.find((file) => file.size > MAX_FILE_SIZE);
    if (tooLarge) {
      setError("Размер каждого файла должен быть до 10 МБ.");
      return;
    }

    setFiles(selected);
  };

  const selectedCountry =
    PHONE_COUNTRIES_BY_CODE.get(selectedCountryCode) ?? PHONE_COUNTRIES[0];

  const normalizePhone = (value: string, country: PhoneCountry) => {
    let digits = value.replace(/\D/g, "");

    if (["RU", "KZ"].includes(country.code) && digits.startsWith("8")) {
      digits = digits.slice(1);
    }

    if (digits.startsWith(country.dialCode)) {
      digits = digits.slice(country.dialCode.length);
    }

    if (digits.length > country.maxDigits) {
      digits = digits.slice(0, country.maxDigits);
    }

    return digits;
  };

  const formatPhone = (value: string, country: PhoneCountry) => {
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

  const handleCountryChange = (nextCountryCode: string) => {
    const nextCountry =
      PHONE_COUNTRIES_BY_CODE.get(nextCountryCode) ?? PHONE_COUNTRIES[0];

    setSelectedCountryCode(nextCountryCode);
    setClientPhone((currentPhone) => formatPhone(currentPhone, nextCountry));
  };

  useEffect(() => {
    if (!isAreaTooltipOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        areaTooltipButtonRef.current &&
        event.target instanceof Node &&
        !areaTooltipButtonRef.current.contains(event.target)
      ) {
        setIsAreaTooltipOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isAreaTooltipOpen]);

  useEffect(() => {
    if (!isPolicyModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPolicyModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isPolicyModalOpen]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSent(false);

    const phoneDigits = normalizePhone(clientPhone, selectedCountry);

    if (!clientEmail) {
      setError("Введите ваш email.");
      return;
    }

    if (!clientName) {
      setError("Введите имя и компанию.");
      return;
    }

    if (
      phoneDigits.length < selectedCountry.minDigits ||
      phoneDigits.length > selectedCountry.maxDigits
    ) {
      setError("Введите корректный номер телефона.");
      return;
    }

    if (!isPolicyAccepted) {
      setError(
        "Подтвердите согласие на обработку персональных данных, чтобы отправить расчет.",
      );
      return;
    }

    if (!result) return;

    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append(
        "calculation",
        JSON.stringify({
          result,
          inputSummary,
        }),
      );
      formData.append("clientName", clientName);
      formData.append(
        "clientPhone",
        `+${selectedCountry.dialCode}${phoneDigits}`,
      );
      formData.append("clientEmail", clientEmail);
      formData.append("message", message);
      formData.append("personalDataConsent", "accepted");
      formData.append("sourcePageUrl", getEmbedPageUrl());
      files.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/send-calculation", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Не удалось отправить письмо.");
      }

      setIsSent(true);
      setMessage("");
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Не удалось отправить письмо.",
      );
    } finally {
      setIsSending(false);
    }
  };

  if (!result) {
    return (
      <div className="p-6 text-center text-gray-500">
        Заполните форму и нажмите &quot;Рассчитать&quot;
      </div>
    );
  }

  return (
    <>
      <Card className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-none">
        <CardBody className=" p-4 space-y-4">
          {/* Общие показатели */}
          <div className="space-y-2">
            <KeyValue
              keyName="Общая площадь"
              value={`${formatNumber(result.totalArea)} м²`}
              icon={
                <Tooltip
                  content="Площадь рассчитывается без учета технических отступов."
                  style={{ width: 200 }}
                  placement="right"
                  isOpen={isAreaTooltipOpen}
                  onOpenChange={setIsAreaTooltipOpen}
                >
                  <button
                    ref={areaTooltipButtonRef}
                    type="button"
                    aria-label="Пояснение к расчету площади"
                    className={`inline-flex items-center justify-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-[#f99160]/40 ${
                      isAreaTooltipOpen
                        ? "text-amber-400"
                        : "text-gray-300 hover:text-amber-400 active:text-amber-400"
                    }`}
                    onClick={() => setIsAreaTooltipOpen((open) => !open)}
                  >
                    <QuestionCircleFill className="cursor-pointer" />
                  </button>
                </Tooltip>
              }
            />
            <KeyValue
              keyName="Общий периметр"
              value={`${formatNumber(result.totalPerimeter)} м`}
            />
          </div>

          <Divider />
          <div className="space-y-2">
            <KeyValue
              keyName="Материал"
              value={`${formatMoney(result.materialCost)} ₽`}
            />
            <KeyValue
              keyName="Печать"
              value={`${formatMoney(result.printCost)} ₽`}
            />
            <KeyValue
              keyName="Резка"
              value={`${formatMoney(result.cuttingCost)} ₽`}
            />
          </div>

          <Divider className="my-2" />

          {/* Итог */}
          <div className="flex justify-between items-center  rounded-xl">
            <span className="text-lg font-bold text-gray-800">Итого:</span>
            <span className="text-2xl font-extrabold text-[#d43e14]">
              ≈ {formatMoney(result.totalPrice)} ₽
            </span>
          </div>

          {SHOW_SEND && (
            <>
              <Divider className="my-2" />

              <div className="space-y-3">
                <div className="text-sm font-semibold text-gray-800">
                  Отправить расчет
                </div>

                <form className="space-y-3" onSubmit={onSubmit}>
                  <Input
                    isRequired
                    label="Ваше имя"
                    placeholder="Имя и компания"
                    value={clientName}
                    onValueChange={setClientName}
                  />

                  <div className="grid gap-3 grid-cols-[1fr_2fr]">
                    <Select
                      disallowEmptySelection
                      aria-label="Код страны"
                      label="Страна"
                      placeholder="Выберите страну"
                      listboxProps={{ emptyContent: "Нет данных" }}
                      selectedKeys={[selectedCountryCode]}
                      renderValue={(items) =>
                        items.map((item) => {
                          const country = item.key
                            ? PHONE_COUNTRIES_BY_CODE.get(String(item.key))
                            : undefined;

                          if (!country) {
                            return item.textValue;
                          }

                          return (
                            <div
                              className="flex items-center gap-2"
                              key={country.code}
                            >
                              <img
                                src={getCountryFlagUrl(country.code)}
                                alt=""
                                className="h-[14px] w-[20px] rounded-[2px] border border-gray-200 object-cover"
                                loading="lazy"
                              />
                              <span className="text-sm font-medium text-gray-900">
                                +{country.dialCode}
                              </span>
                            </div>
                          );
                        })
                      }
                      onSelectionChange={(keys) => {
                        const nextCountryCode = getSelectedCountryCode(
                          keys as Set<Key> | "all",
                        );

                        if (nextCountryCode) {
                          handleCountryChange(nextCountryCode);
                        }
                      }}
                    >
                      {SORTED_PHONE_COUNTRIES.map((country) => (
                        <SelectItem
                          key={country.code}
                          textValue={`${country.name} +${country.dialCode}`}
                          startContent={
                            <img
                              src={getCountryFlagUrl(country.code)}
                              alt=""
                              className="h-[14px] w-[20px] rounded-[2px] border border-gray-200 object-cover"
                              loading="lazy"
                            />
                          }
                        >
                          {`${country.name} (+${country.dialCode})`}
                        </SelectItem>
                      ))}
                    </Select>

                    <Input
                      isRequired
                      label="Телефон"
                      placeholder="Ваш номер телефона"
                      type="tel"
                      inputMode="tel"
                      value={clientPhone}
                      onValueChange={(value) =>
                        setClientPhone(formatPhone(value, selectedCountry))
                      }
                    />
                  </div>

                  <Input
                    isRequired
                    label="Email"
                    placeholder="Ваша почта"
                    type="email"
                    value={clientEmail}
                    onValueChange={setClientEmail}
                  />

                  <Textarea
                    label="Комментарий"
                    minRows={4}
                    placeholder="Ваш комментарий"
                    value={message}
                    onValueChange={setMessage}
                  />

                  <div className="space-y-1 text-xs text-gray-500">
                    <input
                      ref={fileInputRef}
                      className="sr-only"
                      type="file"
                      multiple
                      onChange={onFilesChange}
                    />
                    <Button
                      type="button"
                      radius="lg"
                      size="sm"
                      variant="flat"
                      className="bg-gray-100 text-gray-700"
                      onPress={() => fileInputRef.current?.click()}
                    >
                      Загрузить ваш макет
                    </Button>
                    <div>До {MAX_FILES} файлов, максимум 10 МБ каждый.</div>
                    {files.length > 0 && (
                      <div className="text-xs text-gray-600">
                        Выбрано файлов: {files.length}
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border border-gray-200 p-3">
                    <Switch
                      isSelected={isPolicyAccepted}
                      onValueChange={setIsPolicyAccepted}
                    >
                      <span className="text-sm font-medium text-gray-800">
                        Согласие на обработку персональных данных{" "}
                        <span className="text-[#d43e14]">*</span>
                      </span>
                    </Switch>
                    <div className="mt-2 text-xs text-gray-500">
                      Настоящим подтверждаю, что я ознакомлен и согласен с
                      условиями{" "}
                      <span
                        role="button"
                        tabIndex={0}
                        className="appearance-none border-0 bg-transparent p-0 font-medium text-[#d43e14] underline decoration-from-font underline-offset-2 transition cursor-pointer focus:outline-none"
                        onClick={() => setIsPolicyModalOpen(true)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setIsPolicyModalOpen(true);
                          }
                        }}
                        aria-pressed="false"
                      >
                        оферты и политики конфиденциальности
                      </span>
                      .
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                      {error}
                    </div>
                  )}
                  {isSent && (
                    <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-600">
                      Письмо отправлено. Мы свяжемся с вами.
                    </div>
                  )}

                  <Button
                    fullWidth
                    color="default"
                    className="bg-gradient-to-r from-[#f99160] to-[#d43e14] text-white hover:brightness-95"
                    size="lg"
                    type="submit"
                    isDisabled={isSending}
                  >
                    {isSending ? "Отправляем..." : "Отправить расчет"}
                  </Button>
                </form>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      {isPolicyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <button
            type="button"
            aria-label="Закрыть политику обработки персональных данных"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsPolicyModalOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="personal-data-policy-title"
            className="relative z-10 max-h-full w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h3
                  className="text-lg font-semibold text-gray-900"
                  id="personal-data-policy-title"
                >
                  Политика обработки персональных данных
                </h3>
              </div>
              <button
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                type="button"
                aria-label="Закрыть политику"
                onClick={() => setIsPolicyModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-4 text-sm leading-6 text-gray-700">
              {PERSONAL_DATA_POLICY_SECTIONS.map((section) => (
                <section className="space-y-2" key={section.title}>
                  <h4 className="font-semibold text-gray-900">
                    {section.title}
                  </h4>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </div>

            <div className="border-t border-gray-200 px-5 py-4">
              <button
                className="rounded-lg bg-gradient-to-r from-[#f99160] to-[#d43e14] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
                type="button"
                onClick={() => setIsPolicyModalOpen(false)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const KeyValue = ({
  keyName,
  value,
  icon,
}: {
  keyName: string;
  value: ReactNode;
  icon?: ReactNode;
}) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-700">{keyName}:</span>
    <div className="font-medium text-gray-900 flex items-center gap-1">
      {value}
      {icon}
    </div>
  </div>
);
