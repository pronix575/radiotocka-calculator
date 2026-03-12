import { ChangeEvent, FC, FormEvent, ReactNode, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Tooltip } from "@heroui/tooltip";
import { QuestionCircleFill } from "react-bootstrap-icons";

import { CalculationResult } from "../../calculatorService.utils";

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

const showSend = true; // Временно скрываем форму отправки, так как бэкенд еще не готов

export const CalculationResultPanel: FC<CalculationResultPanelProps> = ({
  result,
  inputSummary,
}) => {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

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

  const normalizePhone = (value: string) => {
    let digits = value.replace(/\D/g, "");
    if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
    if (!digits.startsWith("7")) digits = `7${digits}`;
    if (digits.length > 11) digits = digits.slice(0, 11);
    return digits;
  };

  const formatPhone = (value: string) => {
    const digits = normalizePhone(value);
    const rest = digits.slice(1);
    const parts = [
      rest.slice(0, 3),
      rest.slice(3, 6),
      rest.slice(6, 8),
      rest.slice(8, 10),
    ].filter(Boolean);

    let formatted = "+7";
    if (parts[0]) formatted += ` (${parts[0]}`;
    if (parts[0]?.length === 3) formatted += ")";
    if (parts[1]) formatted += ` ${parts[1]}`;
    if (parts[2]) formatted += `-${parts[2]}`;
    if (parts[3]) formatted += `-${parts[3]}`;
    return formatted;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSent(false);

    const phoneDigits = normalizePhone(clientPhone);

    if (!clientEmail) {
      setError("Введите ваш email.");
      return;
    }

    if (!clientName) {
      setError("Введите имя и компанию.");
      return;
    }

    if (phoneDigits.length !== 11) {
      setError("Введите корректный номер телефона.");
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
      formData.append("clientPhone", phoneDigits);
      formData.append("clientEmail", clientEmail);
      formData.append("message", message);
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
    <Card className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-none">
      <CardBody className=" p-4 space-y-4">
        {/* Общие показатели */}
        <div className="space-y-2">
          <KeyValue
            keyName="Общая площадь"
            value={`${result.totalArea.toFixed(2)} м²`}
            icon={
              <Tooltip
                content={`Площадь рассчитывается без учета \n технических отступов.`}
                style={{ width: 200 }}
                placement="right"
              >
                <QuestionCircleFill className="text-gray-300 hover:text-amber-400 transition cursor-pointer" />
              </Tooltip>
            }
          />
          <KeyValue
            keyName="Общий периметр"
            value={`${result.totalPerimeter.toFixed(2)} м`}
          />
        </div>

        <Divider />
        <div className="space-y-2">
          <KeyValue
            keyName="Материал"
            value={`${result.materialCost.toFixed(2)} ₽`}
          />
          <KeyValue
            keyName="Печать"
            value={`${result.printCost.toFixed(2)} ₽`}
          />
          <KeyValue
            keyName="Резка"
            value={`${result.cuttingCost.toFixed(2)} ₽`}
          />
        </div>

        <Divider className="my-2" />

        {/* Итог */}
        <div className="flex justify-between items-center  rounded-xl">
          <span className="text-lg font-bold text-gray-800">Итого:</span>
          <span className="text-2xl font-extrabold text-[#d43e14]">
            ≈ {result.totalPrice.toFixed(2)} ₽
          </span>
        </div>

        {showSend && (
          <>
            <Divider className="my-2" />

            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-800">
                Отправить расчет
              </div>

              <form className="space-y-3" onSubmit={onSubmit}>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#d43e14] focus:ring-2 focus:ring-[#f99160]/40"
              placeholder="Имя (Компания)"
              required
              value={clientName}
              onChange={(event) => setClientName(event.target.value)}
            />
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#d43e14] focus:ring-2 focus:ring-[#f99160]/40"
              placeholder="Телефон"
              type="tel"
              inputMode="tel"
              required
              value={clientPhone}
              onChange={(event) => setClientPhone(formatPhone(event.target.value))}
            />
                <input
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#d43e14] focus:ring-2 focus:ring-[#f99160]/40"
                  placeholder="Email для связи"
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(event) => setClientEmail(event.target.value)}
                />
                <textarea
                  className="min-h-[90px] w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#d43e14] focus:ring-2 focus:ring-[#f99160]/40"
                  placeholder="Комментарий"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />

                <div className="space-y-1 text-xs text-gray-500">
                  <input
                    className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-xs file:font-medium file:text-gray-700 hover:file:bg-gray-200"
                    type="file"
                    multiple
                    onChange={onFilesChange}
                  />
                  <div>До {MAX_FILES} файлов, максимум 10 МБ каждый.</div>
                  {files.length > 0 && (
                    <div className="text-xs text-gray-600">
                      Выбрано файлов: {files.length}
                    </div>
                  )}
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

                <button
                  className="w-full rounded-lg bg-gradient-to-r from-[#f99160] to-[#d43e14] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-300"
                  type="submit"
                  disabled={isSending}
                >
                  {isSending ? "Отправляем..." : "Отправить расчет"}
                </button>
              </form>
            </div>
          </>
        )}
      </CardBody>
    </Card>
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
