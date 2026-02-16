import { FC, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Tabs, Tab } from "@heroui/tabs";

import { UnitTranslations } from "@/constants";
import {
  MeasurementUnits,
  ProductionUnitFormValues,
  Unit,
} from "@/calculator/calculatorService.types";

import { validationSchema } from "./ProductionUnitForm.constatns";
import { ProductionUnitFormProps } from "./ProductionUnitForm.types";
import {
  MeasurementUnitsToCoefficient,
  MeasurementUnitsTranslate,
} from "@/calculator/calculatorService.constants";

export const ProductionUnitForm: FC<ProductionUnitFormProps> = ({
  priceList,
  setCalculatingResult,
}) => {
  const formik = useFormik({
    initialValues: {
      amount: null as number | null,
      material: "",
      cutting: "",
      print: "",
      height: "",
      width: "",
      unit: MeasurementUnits.m,
    },
    validateOnChange: true,
    validateOnMount: false,
    validateOnBlur: false,
    validationSchema,
    onSubmit: (values) => {
      setCalculatingResult(values as ProductionUnitFormValues);
    },
  });

  const prevUnitRef = useRef<MeasurementUnits>(formik.values.unit);

  useEffect(() => {
    const currentUnit = formik.values.unit;
    const prevUnit = prevUnitRef.current;

    if (!currentUnit || !prevUnit || currentUnit === prevUnit) {
      prevUnitRef.current = currentUnit;
      return;
    }

    const prevCoef = MeasurementUnitsToCoefficient[prevUnit];
    const nextCoef = MeasurementUnitsToCoefficient[currentUnit];

    const convert = (value: string) => {
      if (!value) return "";

      const numeric = Number(value);
      if (isNaN(numeric)) return "";

      // перевод: текущее значение → в метры → в новую единицу
      return ((numeric * prevCoef) / nextCoef).toString();
    };

    formik.setValues({
      ...formik.values,
      width: convert(formik.values.width),
      height: convert(formik.values.height),
    });

    prevUnitRef.current = currentUnit;
  }, [formik.values.unit]);

  const materialGroup = priceList.find((g) => g.groupName === "Материалы");
  const cuttingGroup = priceList.find((g) => g.groupName === "Резка");
  const printGroup = priceList.find((g) => g.groupName === "Печать");

  return (
    <form className="w-full space-y-4" onSubmit={formik.handleSubmit}>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-[16px]">Расчет стоимости</h1>

        <Tabs
          selectedKey={formik.values.unit}
          onSelectionChange={(key) =>
            formik.setFieldValue("unit", key as MeasurementUnits)
          }
        >
          {Object.values(MeasurementUnits).map((measurementUnit) => (
            <Tab
              key={measurementUnit}
              title={MeasurementUnitsTranslate[measurementUnit]}
            />
          ))}
        </Tabs>
      </div>

      {/* размеры */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* количество */}
        <Input
          label="Количество"
          inputMode="numeric"
          pattern="[0-9]*"
          value={formik.values.amount?.toString() || ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            formik.setFieldValue("amount", value ? Number(value) : null);
          }}
          errorMessage={
            formik.touched.amount ? formik.errors.amount : undefined
          }
          isInvalid={!!(formik.touched.amount && formik.errors.amount)}
          onBlur={() => formik.setFieldTouched("amount", true)}
        />

        <Input
          label="Ширина"
          type="number"
          placeholder="Введите ширину"
          value={formik.values.width}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="width"
          endContent={MeasurementUnitsTranslate[formik.values.unit]}
          isInvalid={!!(formik.touched.width && formik.errors.width)}
          errorMessage={formik.touched.width ? formik.errors.width : undefined}
        />

        <Input
          label="Высота"
          type="number"
          placeholder="Введите высоту"
          value={formik.values.height}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="height"
          endContent={MeasurementUnitsTranslate[formik.values.unit]}
          isInvalid={!!(formik.touched.height && formik.errors.height)}
          errorMessage={
            formik.touched.height ? formik.errors.height : undefined
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
            isInvalid={!!(formik.touched.material && formik.errors.material)}
            errorMessage={
              formik.touched.material ? formik.errors.material : undefined
            }
            onBlur={() => formik.setFieldTouched("material", true)}
          >
            {materialGroup.items.map((item) => {
              const label = `${item.name} (${item.price}₽ / ${UnitTranslations[item.unit as Unit]})`;
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
            isInvalid={!!(formik.touched.cutting && formik.errors.cutting)}
            errorMessage={
              formik.touched.cutting ? formik.errors.cutting : undefined
            }
            onBlur={() => formik.setFieldTouched("cutting", true)}
          >
            {cuttingGroup.items.map((item) => {
              const label = `${item.name} (${item.price}₽ / ${UnitTranslations[item.unit as Unit]})`;
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
            isInvalid={!!(formik.touched.print && formik.errors.print)}
            errorMessage={
              formik.touched.print ? formik.errors.print : undefined
            }
            onBlur={() => formik.setFieldTouched("print", true)}
          >
            {printGroup.items.map((item) => {
              const label = `${item.name} (${item.price}₽ / ${UnitTranslations[item.unit as Unit]})`;
              return (
                <SelectItem key={item.id} textValue={label}>
                  {label}
                </SelectItem>
              );
            })}
          </Select>
        )}
      </div>

      <Button color="primary" type="submit" className="w-full" size="lg">
        Рассчитать
      </Button>
    </form>
  );
};
