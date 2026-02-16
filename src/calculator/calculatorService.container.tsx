import { useEffect, useState } from "react";
import { CalculatorPanel } from "./CalculatorPanel";
import { getPriceList } from "./calculatorService.api";
import { PriceList } from "./calculatorService.types";
import { Skeleton } from "@heroui/skeleton";

export const CalculatorContainer = () => {
  const [priceList, setPriceList] = useState<PriceList>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPriceList = async () => {
      try {
        setIsLoading(true);
        const data = await getPriceList();
        setPriceList(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch price list",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceList();
  }, []);

  return (
    <>
      {isLoading && skeleton}
      {error && <div>Error: {error}</div>}
      {!isLoading && !error && <CalculatorPanel priceList={priceList} />}
    </>
  );
};

const skeleton = (
  <div className="flex flex-col max-w-6xl mx-auto md:flex-row md:gap-6 p-4">
    {/* Левая часть */}
    <div className="w-full md:flex-1">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-1/3 rounded-md bg-default-400" />

          <div className="flex gap-1 bg-default-200 p-1 rounded-xl">
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                className={`h-6 w-8 rounded-md ${
                  i === 0 ? "bg-default-400" : "bg-default-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Blocks */}
        <div className="space-y-3">
          {/* Количество */}
          <Skeleton className="h-14 w-full rounded-xl bg-default-300" />

          {/* Inputs */}
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-16 w-full rounded-xl bg-default-200 flex items-center justify-between px-4"
            >
              <div className="space-y-1.5 w-full">
                <Skeleton className="h-3 w-1/4 rounded-md bg-default-300" />
                <Skeleton className="h-4 w-1/2 rounded-md bg-default-400" />
              </div>
              <Skeleton className="h-4 w-6 rounded-md bg-default-300" />
            </div>
          ))}

          {/* Selects */}
          {[...Array(3)].map((_, i) => (
            <div
              key={`select-${i}`}
              className="h-16 w-full rounded-xl bg-default-200 flex items-center justify-between px-4"
            >
              <div className="space-y-1.5 w-full">
                <Skeleton className="h-3 w-1/3 rounded-md bg-default-300" />
                <Skeleton className="h-4 w-2/3 rounded-md bg-default-400" />
              </div>
              <Skeleton className="h-4 w-4 rounded-md bg-default-300" />
            </div>
          ))}
        </div>

        {/* Button */}
        <Skeleton className="h-14 w-full rounded-xl bg-default-400" />

        {/* Footer */}
        <div className="flex justify-center pt-1">
          <Skeleton className="h-4 w-2/3 rounded-md bg-default-300" />
        </div>
      </div>
    </div>

    {/* Правая панель */}
    <div className="hidden md:block w-full md:w-80">
      <div className="p-4 rounded-2xl border border-default-300 space-y-5">
        {/* Верх */}
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-1/3 rounded-md bg-default-300" />
              <Skeleton className="h-5 w-1/4 rounded-md bg-default-400" />
            </div>
          ))}
        </div>

        <div className="h-px bg-default-300" />

        {/* Средний */}
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-1/3 rounded-md bg-default-300" />
              <Skeleton className="h-5 w-1/4 rounded-md bg-default-400" />
            </div>
          ))}
        </div>

        <div className="h-px bg-default-300" />

        {/* Итог */}
        <div className="flex justify-between items-center pt-1">
          <Skeleton className="h-5 w-1/4 rounded-md bg-default-400" />
          <Skeleton className="h-8 w-1/3 rounded-lg bg-primary/40" />
        </div>
      </div>
    </div>
  </div>
);
