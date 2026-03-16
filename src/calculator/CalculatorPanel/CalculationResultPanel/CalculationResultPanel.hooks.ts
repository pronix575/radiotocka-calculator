import {
  ChangeEvent,
  FormEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  MAX_FILES,
  MAX_FILE_SIZE,
  PHONE_COUNTRIES,
  PHONE_COUNTRIES_BY_CODE,
} from "./CalculationResultPanel.constants";
import { CalculationInputSummary } from "./CalculationResultPanel.types";
import {
  formatPhone,
  getEmbedPageUrl,
  normalizePhone,
  validateSelectedFiles,
} from "./CalculationResultPanel.utils";
import { CalculationResult } from "../../calculatorService.utils";

export const useCloseOnOutsidePointer = (
  isOpen: boolean,
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
) => {
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        ref.current &&
        event.target instanceof Node &&
        !ref.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, onClose, ref]);
};

export const useBodyOverflowLock = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLocked]);
};

export const useCalculationResultPanel = ({
  result,
  inputSummary,
}: {
  result: CalculationResult | null;
  inputSummary: CalculationInputSummary | null;
}) => {
  const [isAreaTooltipOpen, setIsAreaTooltipOpen] = useState(false);
  const areaTooltipButtonRef = useRef<HTMLButtonElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("RU");
  const [clientEmail, setClientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isPolicyAccepted, setIsPolicyAccepted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const selectedCountry =
    PHONE_COUNTRIES_BY_CODE.get(selectedCountryCode) ?? PHONE_COUNTRIES[0];

  const onFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selected = Array.from(event.target.files ?? []);

    const filesError = validateSelectedFiles(
      selected,
      MAX_FILES,
      MAX_FILE_SIZE,
    );

    if (filesError) {
      setError(filesError);
      return;
    }

    setFiles(selected);
  };

  const handleCountryChange = (nextCountryCode: string) => {
    const nextCountry =
      PHONE_COUNTRIES_BY_CODE.get(nextCountryCode) ?? PHONE_COUNTRIES[0];

    setSelectedCountryCode(nextCountryCode);
    setClientPhone((currentPhone) => formatPhone(currentPhone, nextCountry));
  };

  useCloseOnOutsidePointer(isAreaTooltipOpen, areaTooltipButtonRef, () =>
    setIsAreaTooltipOpen(false),
  );

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

  return {
    areaTooltipButtonRef,
    clientEmail,
    clientName,
    clientPhone,
    error,
    fileInputRef,
    files,
    handleCountryChange,
    isAreaTooltipOpen,
    isPolicyAccepted,
    isSending,
    isSent,
    message,
    onFilesChange,
    onSubmit,
    selectedCountry,
    selectedCountryCode,
    setClientEmail,
    setClientName,
    setClientPhone,
    setIsAreaTooltipOpen,
    setIsPolicyAccepted,
    setMessage,
  };
};
