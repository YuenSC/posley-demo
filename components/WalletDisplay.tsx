"use client";

import { ethers } from "ethers";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const USDC_READ_PROXY_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // https://etherscan.io/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48
const USDT_READ_PROXY_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7"; // https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7

const WalletDisplay = () => {
  const [balance, setBalance] = useState<{
    eth: string;
    usdc: string;
    usdt: string;
  }>({ eth: "", usdc: "", usdt: "" });
  const [address, setAddress] = useState(
    "0xF977814e90dA44bFA03b6295A0616a897441aceC"
  );
  const providerRef = useRef(
    window.ethereum ? new ethers.BrowserProvider(window.ethereum) : undefined
  );

  useEffect(() => {
    const getAddressBalance = async () => {
      if (!providerRef.current) return;

      try {
        const usdcContract = new ethers.Contract(
          USDC_READ_PROXY_ADDRESS,
          ["function balanceOf(address) view returns (uint256)"],
          providerRef.current
        );
        const usdtContract = new ethers.Contract(
          USDT_READ_PROXY_ADDRESS,
          ["function balanceOf(address) view returns (uint256)"],
          providerRef.current
        );

        const eth = await providerRef.current.getBalance(address);
        const usdc = await usdcContract.balanceOf(address);
        const usdt = await usdtContract.balanceOf(address);

        setBalance({
          eth: ethers.formatEther(eth),
          usdc: ethers.formatUnits(usdc, 6),
          usdt: ethers.formatUnits(usdt, 6),
        });
      } catch (error) {
        setBalance({ eth: "", usdc: "", usdt: "" });
      }
    };
    getAddressBalance();
  }, [address]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        <Label>Address</Label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <Label>Balance</Label>
      <ul className="list-disc pl-4">
        <li>{balance.eth} ETH</li>
        <li>{balance.usdc} USDC</li>
        <li>{balance.usdt} USDT</li>
      </ul>
    </div>
  );
};

export default WalletDisplay;
