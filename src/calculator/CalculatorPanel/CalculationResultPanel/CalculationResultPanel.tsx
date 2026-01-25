import { FC } from "react";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";

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
        Заполните форму и нажмите "Рассчитать"
      </div>
    );
  }

  return (
    <Card className="w-full shadow-lg rounded-xl overflow-hidden border border-gray-200">
      <CardBody className="bg-gray-50 p-4 space-y-4">
        {/* Общие показатели */}
        <div className="space-y-2">
          <KeyValue
            keyName="Общая площадь"
            value={`${result.totalArea.toFixed(2)} м²`}
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
            value={`${(result.totalArea * result.materialPrice).toFixed(2)} ₽`}
          />
          <KeyValue
            keyName="Печать"
            value={`${(result.totalArea * result.printPrice).toFixed(2)} ₽`}
          />
          <KeyValue
            keyName="Резка"
            value={`${(result.totalPerimeter * result.cuttingPrice).toFixed(
              2,
            )} ₽`}
          />
        </div>

        <Divider className="my-2" />

        {/* Итог */}
        <div className="flex justify-between items-center  rounded-xl">
          <span className="text-lg font-bold text-gray-800">Итого:</span>
          <span className="text-2xl font-extrabold text-green-800">
            {result.totalPrice.toFixed(2)} ₽
          </span>
        </div>
      </CardBody>
    </Card>
  );
};

const KeyValue = ({ keyName, value }: { keyName: string; value: string }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-700">{keyName}:</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);
