"use client";

import { useFetchEthereum } from "@/lib/hooks/useFetchEthereum";
import { useFetchUSDC } from "@/lib/hooks/useFetchUSDC";
import { useFetchUSDT } from "@/lib/hooks/useFetchUSDT";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";

const WalletDisplay = () => {
  const [address, setAddress] = useState(
    "0xF977814e90dA44bFA03b6295A0616a897441aceC"
  );
  const [addressDebounce] = useDebounce(address, 300);

  const { data: eth, isLoading: isLoadingETH } =
    useFetchEthereum(addressDebounce);
  const { data: usdc, isLoading: isLoadingUSDC } =
    useFetchUSDC(addressDebounce);
  const { data: usdt, isLoading: isLoadingUSDT } =
    useFetchUSDT(addressDebounce);

  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-xl">Public Query</h1>
      <div>
        <Label>Address</Label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <div>
        <Label>Balance</Label>
        <ul className="list-disc pl-4">
          <TokenDisplay isLoading={isLoadingETH} unit="ETH" balance={eth} />
          <TokenDisplay isLoading={isLoadingUSDC} unit="USDC" balance={usdc} />
          <TokenDisplay isLoading={isLoadingUSDT} unit="USDT" balance={usdt} />
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
