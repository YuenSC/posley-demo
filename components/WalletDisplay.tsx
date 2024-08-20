"use client";

import { useFetchEthereum } from "@/lib/hooks/useFetchEthereum";
import { useFetchUSDC } from "@/lib/hooks/useFetchUSDC";
import { useFetchUSDT } from "@/lib/hooks/useFetchUSDT";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

const WalletDisplay = () => {
  const [address, setAddress] = useState(
    "0xF977814e90dA44bFA03b6295A0616a897441aceC"
  );
  const [addressDebounce] = useDebounce(address, 300);

  const {
    data: eth,
    isValidating: isValidatingETH,
    mutate: mutateETH,
  } = useFetchEthereum(addressDebounce);
  const {
    data: usdc,
    isValidating: isValidatingUSDC,
    mutate: mutateUSDC,
  } = useFetchUSDC(addressDebounce);
  const {
    data: usdt,
    isValidating: isValidatingUSDT,
    mutate: mutateUSDT,
  } = useFetchUSDT(addressDebounce);

  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-xl">Public Query</h1>
      <div>
        <Label>Address</Label>
        <div className="flex gap-4">
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x..."
          />
          <Button
            onClick={() => {
              mutateETH();
              mutateUSDC();
              mutateUSDT();
            }}
          >
            Refetch{" "}
            {isValidatingETH || isValidatingUSDC || isValidatingUSDT
              ? "..."
              : null}
          </Button>
        </div>
      </div>
      <div>
        <Label>Balance</Label>
        <ul className="list-disc pl-4">
          <TokenDisplay isLoading={isValidatingETH} unit="ETH" balance={eth} />
          <TokenDisplay
            isLoading={isValidatingUSDC}
            unit="USDC"
            balance={usdc}
          />
          <TokenDisplay
            isLoading={isValidatingUSDT}
            unit="USDT"
            balance={usdt}
          />
        </ul>
      </div>
    </div>
  );
};

export default WalletDisplay;

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
      <li>
        <div className="flex items-center gap-2">
          {unit}: <Skeleton className="w-12 h-4" />
        </div>
      </li>
    );
  }

  if (balance === undefined) {
    return <li>{unit}: Error</li>;
  }

  return (
    <li>
      {unit}: ${balance}
    </li>
  );
};
