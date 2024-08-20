"use client";

import { createTransaction } from "@/app/actions";
import { PropsWithChildren } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { FaSpinner } from "react-icons/fa";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const WalletTransaction = () => {
  const [error, action] = useFormState(createTransaction, "");

  return (
    <form className="w-full flex flex-col gap-2" action={action}>
      <h1 className="text-lg">ETH Transaction</h1>
      <div>
        <Label>Your Private Key</Label>
        <Input name="privateKey" placeholder="0x..." required />
      </div>

      <div className="flex items-center gap-2">
        <span>You will transfer</span>
        <Input
          placeholder="0.0"
          type="number"
          className="w-20"
          name="value"
          min={0.1}
          required
        />
        <span>ETH to</span>
        <Input
          placeholder="0x..."
          className="flex-1"
          name="receiverPublicKey"
          required
        />
      </div>
      {error ? <div className="text-red-500 -mt-2">{error}</div> : null}

      <SubmitButton>Transfer</SubmitButton>
    </form>
  );
};

export default WalletTransaction;

const SubmitButton = ({ children }: PropsWithChildren) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="md:self-start">
      {children}
      {pending && <FaSpinner className="animate-spin" />}
    </Button>
  );
};
