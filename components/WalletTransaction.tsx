"use client";

import { createLineaTransaction } from "@/app/actions";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useFetchEthereum } from "@/lib/hooks/useFetchEthereum";
import { ProviderType } from "@/lib/ProviderType";
import { ethers } from "ethers";
import { useMemo, useState } from "react";
import { useFormState } from "react-dom";
import { FaSpinner } from "react-icons/fa";
import { IoMdSync } from "react-icons/io";
import { useSWRConfig } from "swr";
import SubmitButton from "./SubmitButton";
import TokenDisplay from "./TokenDisplay";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";

const DefaultSenderPrivateKey =
  "bea70301d065cf7946f25251c73dbfff93d4320715e43bdc0d5087553074cb64";
const DefaultSenderAddress = "0x1d489c3F8Ed5Ee71325A847888B2157c9ac29c05";
const DefaultReceiverPrivateKey =
  "2dc26635745ab61b8390e2ce8da540f8084c5d74731f740566ff5dfb044be93d";
const DefaultReceiverAddress = "0x772D993986A422df48b5952214b0fe59BD082870";

const WalletTransaction = () => {
  const { mutate } = useSWRConfig();
  const { toast } = useToast();

  const [privateKey, setPrivateKey] = useState(DefaultSenderPrivateKey);
  const [receiverAddress, setReceiverAddress] = useState(
    DefaultReceiverAddress
  );

  const wallet = useMemo(() => {
    if (!privateKey) return null;
    try {
      return new ethers.Wallet(privateKey);
    } catch (error) {
      return null;
    }
  }, [privateKey]);

  const createTransaction = async (
    prevState: string | undefined,
    formData: FormData
  ) => {
    const result = await createLineaTransaction(formData);
    if (result?.error) {
      return result.error;
    }

    toast({
      title: "Transaction Success",
      description: `Please note that the wallet balance may be not sync for a few seconds.`,
    });
    //TODO: It seems immediate fetch will still get the old data
    setTimeout(() => {
      mutate([
        "/api/token/eth",
        { address: wallet?.address, providerType: ProviderType.linea },
      ]);
      mutate([
        "/api/token/eth",
        { address: receiverAddress, providerType: ProviderType.linea },
      ]);
    }, 2000);
  };
  const [error, action] = useFormState(createTransaction, undefined);

  const { data } = useFetchEthereum({
    address: wallet?.address,
    providerType: ProviderType.linea,
  });

  const handleSetData = (senderKey: string, receiverAddress: string) => {
    setPrivateKey(senderKey);
    setReceiverAddress(receiverAddress);
  };

  return (
    <form className="w-full flex flex-col gap-4" action={action}>
      <h1 className="text-2xl">ETH Transaction in Linea Sepolia</h1>

      <Collapsible>
        <CollapsibleTrigger>
          <span className="hover:underline">{`> Develope Testing Utils`}</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="text-sm break-all">
            <div>Testing Sender Private Key - {DefaultSenderPrivateKey}</div>
            <div>Testing Sender Address - {DefaultSenderAddress}</div>
            <div>
              Testing Receiver Private Key - {DefaultReceiverPrivateKey}
            </div>
            <div>Testing Receiver Address - {DefaultReceiverAddress}</div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                handleSetData(DefaultSenderPrivateKey, DefaultReceiverAddress);
              }}
            >{`Sender -> Receiver`}</Button>
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                handleSetData(DefaultReceiverPrivateKey, DefaultSenderAddress);
              }}
            >{`Receiver -> Sender`}</Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex flex-col gap-2">
        <div>
          <Label className="text-base font-normal">Sender Private Key</Label>
          <Input
            name="privateKey"
            placeholder="0x..."
            required
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
        </div>
        <WalletDisplay title="Sender Wallet Detail" address={wallet?.address} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span>You will transfer</span>
          <Input
            placeholder="0.0"
            type="number"
            className="w-20"
            name="amount"
            max={data ? parseFloat(data) : undefined}
            min={0}
            step={0.01}
            required
            defaultValue={0.01}
          />
          <span>ETH to</span>
          <Input
            placeholder="0x..."
            className="flex-1"
            name="receiverAddress"
            required
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
          />
        </div>
        <WalletDisplay
          title="Receiver Wallet Detail"
          address={receiverAddress}
        />
      </div>

      {error ? <div className="text-red-500 -mt-2">{error}</div> : null}

      <SubmitButton>Transfer</SubmitButton>
    </form>
  );
};

export default WalletTransaction;

const WalletDisplay = ({
  title,
  address,
}: {
  title: string;
  address?: string;
}) => {
  const validAddress = ethers.isAddress(address) ? address : "";
  const { data, isValidating, mutate } = useFetchEthereum({
    address: validAddress,
    providerType: ProviderType.linea,
  });

  return (
    <div className="border p-2 rounded-md text-xs">
      <div className="flex justify-between">
        <h2>{title}</h2>
        <Button
          variant={"outline"}
          size={"icon"}
          className="h-5 w-5"
          onClick={(e) => {
            e.preventDefault();
            mutate();
          }}
        >
          {isValidating ? (
            <FaSpinner className="animate-spin " />
          ) : (
            <IoMdSync />
          )}
        </Button>
      </div>
      <div className="break-all">
        Your wallet address: {validAddress || "Unknown"}
      </div>

      <div>
        Your wallet balance:{" "}
        <TokenDisplay balance={data} isLoading={isValidating} unit="LineaETH" />
      </div>
    </div>
  );
};
