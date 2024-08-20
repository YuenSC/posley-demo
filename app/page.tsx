import { Separator } from "@/components/ui/separator";
import WalletDisplay from "@/components/WalletDisplay";
import WalletTransaction from "@/components/WalletTransaction";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <WalletDisplay />
      <Separator className="my-4" />
      <WalletTransaction />
    </main>
  );
}
