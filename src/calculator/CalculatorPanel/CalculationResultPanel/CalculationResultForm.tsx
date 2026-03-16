import { ChangeEvent, FC, FormEvent, Key, RefObject } from "react";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";

import {
  MAX_FILES,
  PHONE_COUNTRIES_BY_CODE,
  PhoneCountry,
  SORTED_PHONE_COUNTRIES,
} from "./CalculationResultPanel.constants";
import {
  CountryFlag,
  formatPhone,
  getSelectedCountryCode,
} from "./CalculationResultPanel.utils";

type CalculationResultFormProps = {
  clientEmail: string;
  clientName: string;
  clientPhone: string;
  error: string | null;
  files: File[];
  fileInputRef: RefObject<HTMLInputElement>;
  isPolicyAccepted: boolean;
  isSending: boolean;
  isSent: boolean;
  message: string;
  onFilesChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onOpenPolicy: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  selectedCountry: PhoneCountry;
  selectedCountryCode: string;
  setClientEmail: (value: string) => void;
  setClientName: (value: string) => void;
  setClientPhone: (value: string) => void;
  setIsPolicyAccepted: (value: boolean) => void;
  setMessage: (value: string) => void;
  handleCountryChange: (countryCode: string) => void;
};

export const CalculationResultForm: FC<CalculationResultFormProps> = ({
  clientEmail,
  clientName,
  clientPhone,
  error,
  files,
  fileInputRef,
  isPolicyAccepted,
  isSending,
  isSent,
  message,
  onFilesChange,
  onOpenPolicy,
  onSubmit,
  selectedCountry,
  selectedCountryCode,
  setClientEmail,
  setClientName,
  setClientPhone,
  setIsPolicyAccepted,
  setMessage,
  handleCountryChange,
}) => (
  <div className="space-y-3">
    <div className="text-[16px] font-semibold text-gray-800">
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
                <div className="flex items-center gap-2" key={country.code}>
                  <CountryFlag countryCode={country.code} />
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
              startContent={<CountryFlag countryCode={country.code} />}
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
          <div className="text-xs text-gray-600">Выбрано файлов: {files.length}</div>
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
          Настоящим подтверждаю, что я ознакомлен и согласен с условиями{" "}
          <span
            role="button"
            tabIndex={0}
            className="appearance-none border-0 bg-transparent p-0 font-medium text-[#d43e14] underline decoration-from-font underline-offset-2 transition cursor-pointer focus:outline-none"
            onClick={onOpenPolicy}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpenPolicy();
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
);
