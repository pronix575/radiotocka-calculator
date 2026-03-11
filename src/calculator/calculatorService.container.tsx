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
      <div className="space-y-4">
        <Skeleton className="h-6 w-2/5 rounded-md bg-default-300" />
        <Skeleton className="h-14 w-full rounded-xl bg-default-200" />
        <Skeleton className="h-14 w-full rounded-xl bg-default-200" />
        <Skeleton className="h-12 w-full rounded-xl bg-default-400" />
      </div>
    </div>

    {/* Правая панель */}
    <div className="hidden md:block w-full md:w-80">
      <div className="p-4 rounded-2xl border border-default-300 space-y-4">
        <Skeleton className="h-4 w-2/3 rounded-md bg-default-300" />
        <Skeleton className="h-4 w-1/2 rounded-md bg-default-300" />
        <div className="h-px bg-default-300" />
        <Skeleton className="h-8 w-2/3 rounded-lg bg-[#f99160]/40" />
      </div>
    </div>
  </div>
);
