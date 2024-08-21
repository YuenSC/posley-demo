"use client";

import { useFetchEthereum } from "@/lib/hooks/useFetchEthereum";
import { useFetchUSDC } from "@/lib/hooks/useFetchUSDC";
import { useFetchUSDT } from "@/lib/hooks/useFetchUSDT";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import TokenDisplay from "./TokenDisplay";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ethers } from "ethers";

const BalanceDisplay = () => {
  const [address, setAddress] = useState(
    "0xF977814e90dA44bFA03b6295A0616a897441aceC"
  );
  const [addressDebounce] = useDebounce(
    ethers.isAddress(address) ? address : "",
    300
  );

  const {
    data: eth,
    isValidating: isValidatingETH,
    mutate: mutateETH,
  } = useFetchEthereum({ address: addressDebounce });
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
      <h1 className="text-2xl">Public Balance Query</h1>
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
        <ul className="list-disc pl-4 ">
          <li>
            <TokenDisplay
              isLoading={isValidatingETH}
              unit="ETH"
              balance={eth}
            />
          </li>
          <li>
            <TokenDisplay
              isLoading={isValidatingUSDC}
              unit="USDC"
              balance={usdc}
            />
          </li>

          <li>
            <TokenDisplay
              isLoading={isValidatingUSDT}
              unit="USDT"
              balance={usdt}
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BalanceDisplay;
