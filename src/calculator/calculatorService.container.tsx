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
  <div className="flex flex-col justify-center max-w-6xl mx-auto gap-0 md:flex-row md:gap-x-4">
    <div className="w-full md:flex-1">
      <div className="p-6 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-1/3 rounded-lg bg-default-300" />

          <div className="flex gap-1 bg-default-200 p-1 rounded-xl">
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                className={`h-6 w-8 rounded-lg ${
                  i === 0 ? "bg-default-400" : "bg-default-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Blocks */}
        <div className="space-y-2">
          <Skeleton className="h-14 w-full rounded-2xl bg-default-300" />

          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 w-full rounded-2xl bg-default-200 flex items-center justify-between px-4"
            >
              <div className="space-y-2 w-full">
                <Skeleton className="h-3 w-1/3 rounded-lg bg-default-300" />
                <Skeleton className="h-4 w-2/3 rounded-lg bg-default-400" />
              </div>
              <Skeleton className="h-4 w-6 rounded-lg bg-default-300" />
            </div>
          ))}
        </div>

        <Skeleton className="h-14 w-full rounded-2xl bg-default-400" />

        <div className="flex justify-center">
          <Skeleton className="h-4 w-3/4 rounded-lg bg-default-300" />
        </div>
      </div>
    </div>
    <div className="p-3 w-full md:w-80 hidden md:block">
      <div className="p-3 rounded-2xl border border-default-300 space-y-5">
        {/* Верхний блок */}
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-1/3 rounded-md bg-default-300" />
              <Skeleton className="h-5 w-1/4 rounded-md bg-default-400" />
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-default-300" />

        {/* Средний блок */}
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-1/3 rounded-md bg-default-300" />
              <Skeleton className="h-5 w-1/4 rounded-md bg-default-400" />
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-default-300" />

        {/* Итог */}
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-1/4 rounded-md bg-default-400" />
          <Skeleton className="h-8 w-1/3 rounded-lg bg-primary/40" />
        </div>
      </div>
    </div>
  </div>
);
