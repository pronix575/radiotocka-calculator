import { FC, ReactNode } from "react";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Tooltip } from "@heroui/tooltip";
import { QuestionCircleFill } from "react-bootstrap-icons";

import {
  PERSONAL_DATA_POLICY_SECTIONS,
  SHOW_SEND,
} from "./CalculationResultPanel.constants";
import { CalculationResultForm } from "./CalculationResultForm";
import { PolicyModal } from "./PolicyModal";
import { useCalculationResultPanel } from "./CalculationResultPanel.hooks";
import { CalculationResultPanelProps } from "./CalculationResultPanel.types";
import { formatMoney, formatNumber } from "../../../../shared/formatters";

export const CalculationResultPanel: FC<CalculationResultPanelProps> = ({
  result,
  inputSummary,
}) => {
  const {
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
    isPolicyModalOpen,
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
    setIsPolicyModalOpen,
    setMessage,
  } = useCalculationResultPanel({
    result,
    inputSummary,
  });

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
              <Divider className="-mx-4 mt-0 mb-4 w-auto" />
              <CalculationResultForm
                clientEmail={clientEmail}
                clientName={clientName}
                clientPhone={clientPhone}
                error={error}
                files={files}
                fileInputRef={fileInputRef}
                handleCountryChange={handleCountryChange}
                isPolicyAccepted={isPolicyAccepted}
                isSending={isSending}
                isSent={isSent}
                message={message}
                onFilesChange={onFilesChange}
                onOpenPolicy={() => setIsPolicyModalOpen(true)}
                onSubmit={onSubmit}
                selectedCountry={selectedCountry}
                selectedCountryCode={selectedCountryCode}
                setClientEmail={setClientEmail}
                setClientName={setClientName}
                setClientPhone={setClientPhone}
                setIsPolicyAccepted={setIsPolicyAccepted}
                setMessage={setMessage}
              />
            </>
          )}
        </CardBody>
      </Card>

      {isPolicyModalOpen && (
        <PolicyModal
          isOpen={isPolicyModalOpen}
          onOpenChange={setIsPolicyModalOpen}
          sections={PERSONAL_DATA_POLICY_SECTIONS}
        />
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
