import React from "react";
import { Skeleton } from "./ui/skeleton";

const TokenDisplay = ({
  isLoading,
  unit,
  balance,
}: {
  isLoading: boolean;
  unit: string;
  balance: string | undefined;
}) => {
  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-2">
        {unit}: <Skeleton className="w-12 h-4" />
      </span>
    );
  }

  if (balance === undefined) {
    return <span>{unit}: Error</span>;
  }

  return (
    <span>
      {unit}: ${balance}
    </span>
  );
};

export default TokenDisplay;
