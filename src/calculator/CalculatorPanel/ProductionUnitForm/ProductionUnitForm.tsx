import { FC, useEffect, useRef } from "react";
import { useFormik, yupToFormErrors } from "formik";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { Tabs, Tab } from "@heroui/tabs";

import { UnitTranslations } from "@/constants";
import {
  MeasurementUnits,
  ProductionUnitFormValues,
  Unit,
} from "@/calculator/calculatorService.types";

import {
  DEFAULT_MAX_HEIGHT_M,
  DEFAULT_MAX_WIDTH_M,
  validationSchema,
} from "./ProductionUnitForm.constatns";
import { ProductionUnitFormProps } from "./ProductionUnitForm.types";
import {
  MeasurementUnitsToCoefficient,
  MeasurementUnitsTranslate,
} from "@/calculator/calculatorService.constants";

export const ProductionUnitForm: FC<ProductionUnitFormProps> = ({
  priceList,
  setCalculatingResult,
  reset,
}) => {
  const materialGroup = priceList.find((g) => g.groupName === "Материалы");
  const cuttingGroup = priceList.find((g) => g.groupName === "Резка");
  const printGroup = priceList.find((g) => g.groupName === "Печать");

  const parseMaterialName = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length <= 1) return { base: name.trim(), thickness: "" };
    return { base: parts[0], thickness: parts.slice(1).join(" ") };
  };

  const materialItems = materialGroup?.items ?? [];

  const materialsByBase = materialItems.reduce<
    Record<string, typeof materialItems>
  >((acc, item) => {
    const { base } = parseMaterialName(item.name);
    if (!acc[base]) acc[base] = [];
    acc[base].push(item);
    return acc;
  }, {});

  const getMaxDimension = (
    items: Array<{ width?: number; height?: number } | null | undefined>,
    key: "width" | "height",
    fallback: number,
  ) => {
    const values = items
      .map((item) => item?.[key])
      .filter((value): value is number => value !== undefined && !isNaN(value));

    return values.length > 0 ? Math.min(...values) : fallback;
  };

  const formik = useFormik({
    initialValues: {
      amount: null as number | null,
      materialBase: "",
      material: "",
      cutting: "",
      print: "",
      height: "",
      width: "",
      patternedCuttingEnabled: false,
      patternedPerimeter: "",
      unit: MeasurementUnits.m,
    },
    validateOnChange: false,
    validateOnMount: false,
    validateOnBlur: false,
    validate: (values) => {
      const selectedMaterialItem = materialGroup?.items.find(
        (item) => item.id === values.material,
      );
      const selectedCuttingItem = cuttingGroup?.items.find(
        (item) => item.id === values.cutting,
      );
      const selectedPrintItem = printGroup?.items.find(
        (item) => item.id === values.print,
      );

      const maxWidth = getMaxDimension(
        [selectedMaterialItem, selectedCuttingItem, selectedPrintItem],
        "width",
        DEFAULT_MAX_WIDTH_M,
      );
      const maxHeight = getMaxDimension(
        [selectedMaterialItem, selectedCuttingItem, selectedPrintItem],
        "height",
        DEFAULT_MAX_HEIGHT_M,
      );

      try {
        validationSchema.validateSync(values, {
          abortEarly: false,
          context: { ...values, maxWidth, maxHeight },
        });
        return {};
      } catch (error) {
        return yupToFormErrors(error);
      }
    },
    onSubmit: (values) => {
      const coef = MeasurementUnitsToCoefficient[values.unit];

      const toMeters = (value: string) => {
        const numeric = Number(value);
        if (isNaN(numeric)) return 0;
        return numeric * coef;
      };

      const normalizedValues: ProductionUnitFormValues = {
        ...values,
        amount: values.amount ?? 0,
        width: toMeters(values.width).toString(),
        height: toMeters(values.height).toString(),
        patternedPerimeter: values.patternedCuttingEnabled
          ? toMeters(values.patternedPerimeter).toString()
          : "",
      };

      setCalculatingResult(normalizedValues);
    },
  });

  const shouldShowError = (field: keyof ProductionUnitFormValues) =>
    Boolean(formik.errors[field]) &&
    (Boolean(formik.touched[field]) || formik.submitCount > 0) &&
    (field !== "material" || Boolean(formik.values.materialBase));

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

      return ((numeric * prevCoef) / nextCoef).toFixed(2).toString();
    };

    formik.setValues({
      ...formik.values,
      width: convert(formik.values.width),
      height: convert(formik.values.height),
      patternedPerimeter: convert(formik.values.patternedPerimeter),
    });

    prevUnitRef.current = currentUnit;
  }, [formik.values.unit]);

  const selectedMaterial = formik.values.material;
  const selectedMaterialBase = formik.values.materialBase;
  const isMaterialSelected = !!selectedMaterial;
  const isMaterialBaseSelected = !!selectedMaterialBase;

  const materialBaseOptions = Object.keys(materialsByBase).sort((a, b) =>
    a.localeCompare(b, "ru"),
  );

  const thicknessOptions =
    (selectedMaterialBase ? materialsByBase[selectedMaterialBase] : []) ?? [];

  const filteredCuttingItems =
    cuttingGroup?.items.filter((item) => {
      if (!selectedMaterial) return true;
      if (!item.lockId?.length) return true;
      return item.lockId.includes(selectedMaterial);
    }) ?? [];

  const filteredPrintItems =
    printGroup?.items.filter((item) => {
      if (!selectedMaterial) return true;
      if (!item.lockId?.length) return true;
      return item.lockId.includes(selectedMaterial);
    }) ?? [];

  useEffect(() => {
    if (
      formik.values.cutting &&
      !filteredCuttingItems.some((i) => i.id === formik.values.cutting)
    ) {
      formik.setFieldValue("cutting", "");
    }

    if (
      formik.values.print &&
      !filteredPrintItems.some((i) => i.id === formik.values.print)
    ) {
      formik.setFieldValue("print", "");
    }
  }, [selectedMaterial]);

  return (
    <form className="w-full space-y-4">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="font-semibold text-[20px] whitespace-nowrap">
          Расчет стоимости
        </h1>

        <div className="flex gap-2 items-center">
          <Tabs
            fullWidth
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

          <Button
            variant="flat"
            onPress={() => {
              formik.resetForm();
              reset();
            }}
          >
            Сбросить
          </Button>
        </div>
      </div>

      {/* Материал */}
      {materialGroup && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Материал"
            placeholder="Выберите материал"
            selectedKeys={selectedMaterialBase ? [selectedMaterialBase] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              formik.setFieldValue("materialBase", value);
              formik.setFieldValue("material", "");
              formik.setFieldValue("cutting", "");
              formik.setFieldValue("print", "");
            }}
            isInvalid={shouldShowError("materialBase")}
            errorMessage={
              shouldShowError("materialBase")
                ? formik.errors.materialBase
                : undefined
            }
          >
            {materialBaseOptions.map((base) => (
              <SelectItem key={base} textValue={base}>
                {base}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Толщина"
            placeholder="Выберите толщину"
            isDisabled={!isMaterialBaseSelected}
            selectedKeys={selectedMaterial ? [selectedMaterial] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              formik.setFieldValue("material", value);
              formik.setFieldTouched("material", true, false);
            }}
            isInvalid={shouldShowError("material")}
            errorMessage={
              shouldShowError("material") ? formik.errors.material : undefined
            }
          >
            {thicknessOptions.map((item) => {
              const { thickness } = parseMaterialName(item.name);
              const label = `${thickness || item.name} (${item.price}₽ / ${UnitTranslations[item.unit as Unit]})${item.minCost ? `, мин. ${item.minCost}₽` : ""}`;

              return (
                <SelectItem key={item.id} textValue={label}>
                  {label}
                </SelectItem>
              );
            })}
          </Select>
        </div>
      )}

      {/* размеры */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="col-span-2 md:col-span-1">
          <Input
            label="Количество"
            inputMode="numeric"
            isDisabled={!isMaterialSelected}
            value={formik.values.amount?.toString() || ""}
            onBlur={formik.handleBlur}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              formik.setFieldValue("amount", value ? Number(value) : null);
            }}
            isInvalid={shouldShowError("amount")}
            errorMessage={
              shouldShowError("amount") ? formik.errors.amount : undefined
            }
          />
        </div>

        <Input
          label="Ширина"
          name="width"
          type="number"
          isDisabled={!isMaterialSelected}
          value={formik.values.width}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          endContent={MeasurementUnitsTranslate[formik.values.unit]}
          isInvalid={shouldShowError("width")}
          errorMessage={
            shouldShowError("width") ? formik.errors.width : undefined
          }
        />

        <Input
          label="Высота"
          name="height"
          type="number"
          isDisabled={!isMaterialSelected}
          value={formik.values.height}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          endContent={MeasurementUnitsTranslate[formik.values.unit]}
          isInvalid={shouldShowError("height")}
          errorMessage={
            shouldShowError("height") ? formik.errors.height : undefined
          }
        />
      </div>

      <div className="rounded-xl border border-gray-200 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-gray-800">
              Узорная резка
            </div>
            <div className="text-xs text-gray-500">
              Укажите длину контура реза вручную для расчета резки.
            </div>
          </div>
          <Switch
            isSelected={formik.values.patternedCuttingEnabled}
            isDisabled={!isMaterialSelected}
            onValueChange={(value) => {
              formik.setFieldValue("patternedCuttingEnabled", value);
              if (!value) {
                formik.setFieldValue("patternedPerimeter", "");
              }
            }}
          />
        </div>

        {formik.values.patternedCuttingEnabled && (
          <div className="mt-3">
            <Input
              label="Длина контура"
              name="patternedPerimeter"
              type="number"
              value={formik.values.patternedPerimeter}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={shouldShowError("patternedPerimeter")}
              errorMessage={
                shouldShowError("patternedPerimeter")
                  ? formik.errors.patternedPerimeter
                  : undefined
              }
              endContent={MeasurementUnitsTranslate[formik.values.unit]}
            />
          </div>
        )}
      </div>

      {/* Резка */}
      {cuttingGroup && (
        <Select
          label="Резка"
          placeholder="Выберите резку"
          isDisabled={!isMaterialSelected}
          selectedKeys={formik.values.cutting ? [formik.values.cutting] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            formik.setFieldValue("cutting", value);
            formik.setFieldTouched("cutting", true, false);
          }}
          nonce="Нет данных"
          isInvalid={shouldShowError("cutting")}
          errorMessage={
            shouldShowError("cutting") ? formik.errors.cutting : undefined
          }
        >
          {filteredCuttingItems.map((item) => {
            const label = `${item.name} (${item.price}₽ / ${UnitTranslations[item.unit as Unit]})${item.minCost ? `, мин. ${item.minCost}₽` : ""}`;

            return (
              <SelectItem key={item.id} textValue={label}>
                {label}
              </SelectItem>
            );
          })}
        </Select>
      )}

      {/* Печать */}
      {printGroup && (
        <Select
          label="Печать"
          placeholder="Выберите печать"
          isDisabled={!isMaterialSelected}
          selectedKeys={formik.values.print ? [formik.values.print] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            formik.setFieldValue("print", value);
            formik.setFieldTouched("print", true, false);
          }}
          isInvalid={shouldShowError("print")}
          errorMessage={
            shouldShowError("print") ? formik.errors.print : undefined
          }
        >
          {filteredPrintItems.map((item) => {
            const label = `${item.name} (${item.price}₽ / ${UnitTranslations[item.unit as Unit]})${item.minCost ? `, мин. ${item.minCost}₽` : ""}`;

            return (
              <SelectItem key={item.id} textValue={label}>
                {label}
              </SelectItem>
            );
          })}
        </Select>
      )}

      <Button
        color="default"
        className="w-full bg-gradient-to-r from-[#f99160] to-[#d43e14] text-white hover:brightness-95"
        size="lg"
        onPress={() => formik.handleSubmit()}
      >
        Рассчитать
      </Button>
    </form>
  );
};
