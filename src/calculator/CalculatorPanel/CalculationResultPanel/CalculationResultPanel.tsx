import { FC, ReactNode } from "react";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Tooltip } from "@heroui/tooltip";
import { QuestionCircleFill } from "react-bootstrap-icons";

import { CalculationResult } from "../../calculatorService.utils";

interface CalculationResultPanelProps {
  result: CalculationResult | null;
}

export const CalculationResultPanel: FC<CalculationResultPanelProps> = ({
  result,
}) => {
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
          <span className="text-2xl font-extrabold text-[#006FEE]">
            ≈ {result.totalPrice.toFixed(2)} ₽
          </span>
        </div>
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
