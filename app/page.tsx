import { Separator } from "@/components/ui/separator";
import BalanceDisplay from "@/components/BalanceDisplay";
import WalletTransaction from "@/components/WalletTransaction";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center  p-24 container">
      <BalanceDisplay />
      <Separator className="my-4" />
      <WalletTransaction />
    </main>
  );
}
