import { useEffect, useState } from "react";
import { CalculatorPanel } from "./CalculatorPanel";
import { getPriceList } from "./calculatorService.api";
import { PriceList } from "./calculatorService.types";

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
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {!isLoading && !error && <CalculatorPanel priceList={priceList} />}
    </>
  );
};
