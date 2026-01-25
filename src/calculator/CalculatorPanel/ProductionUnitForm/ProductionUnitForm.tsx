import { FC } from "react";
import { useFormik } from "formik";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

import { ProductionUnitFormProps } from "./ProductionUnitForm.types";
import { ProductionUnitFormValues } from "../../calculatorService.types";

export const ProductionUnitForm: FC<ProductionUnitFormProps> = ({
  priceList,
}) => {
  const formik = useFormik<ProductionUnitFormValues>({
    initialValues: {
      amount: 0,
      material: "",
      cutting: "",
      print: "",
      height: 0,
      width: 0,
    },
    onSubmit: (values) => {
      console.log("Form submitted:", values);
    },
  });

  const materialGroup = priceList.find((g) => g.groupName === "Материалы");
  const cuttingGroup = priceList.find((g) => g.groupName === "Резка");
  const printGroup = priceList.find((g) => g.groupName === "Печать");

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full max-w-2xl mx-auto p-6 space-y-6"
    >
      {/* размеры */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* количество */}
        <Input
          label="Количество"
          type="number"
          value={formik.values.amount.toString()}
          onChange={(e) =>
            formik.setFieldValue("amount", parseInt(e.target.value) || 0)
          }
        />

        <Input
          label="Ширина (м)"
          type="number"
          value={formik.values.width.toString()}
          onChange={(e) =>
            formik.setFieldValue("width", parseFloat(e.target.value) || 0)
          }
        />

        <Input
          label="Высота (м)"
          type="number"
          value={formik.values.height.toString()}
          onChange={(e) =>
            formik.setFieldValue("height", parseFloat(e.target.value) || 0)
          }
        />
      </div>

      {/* селекты */}
      <div className="flex flex-col gap-4">
        {/* МАТЕРИАЛ */}
        {materialGroup && (
          <Select
            label="Материал"
            placeholder="Выберите материал"
            selectedKeys={
              formik.values.material ? [formik.values.material] : []
            }
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              formik.setFieldValue("material", value);
            }}
          >
            {materialGroup.items.map((item) => {
              const label = `${item.name} (${item.price}/${item.unit})`;

              return (
                <SelectItem key={item.id} textValue={label}>
                  {label}
                </SelectItem>
              );
            })}
          </Select>
        )}

        {/* РЕЗКА */}
        {cuttingGroup && (
          <Select
            label="Резка"
            placeholder="Выберите резку"
            selectedKeys={formik.values.cutting ? [formik.values.cutting] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              formik.setFieldValue("cutting", value);
            }}
          >
            {cuttingGroup.items.map((item) => {
              const label = `${item.name} (${item.price} ${item.unit})`;

              return (
                <SelectItem key={item.id} textValue={label}>
                  {label}
                </SelectItem>
              );
            })}
          </Select>
        )}

        {/* ПЕЧАТЬ */}
        {printGroup && (
          <Select
            label="Печать"
            placeholder="Выберите печать"
            selectedKeys={formik.values.print ? [formik.values.print] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              formik.setFieldValue("print", value);
            }}
          >
            {printGroup.items.map((item) => {
              const label = `${item.name} (${item.price} ${item.unit})`;

              return (
                <SelectItem key={item.id} textValue={label}>
                  {label}
                </SelectItem>
              );
            })}
          </Select>
        )}
      </div>

      <Button color="primary" type="submit" className="w-full">
        Рассчитать
      </Button>
    </form>
  );
};
