"use server";

import { z } from "zod";
import { ethers } from "ethers";

const schema = z.object({
  privateKey: z.string(),
  receiverAddress: z.string(),
  amount: z.number(),
});

export const createLineaTransaction = async (formData: FormData) => {
  try {
    const rawFormData = {
      privateKey: formData.get("privateKey"),
      receiverAddress: formData.get("receiverAddress"),
      amount: parseFloat(formData.get("amount") as string),
    };
    const { amount, privateKey, receiverAddress } = schema.parse(rawFormData);

    const provider = new ethers.JsonRpcProvider(
      process.env.INFURA_LINEA_SEPOLIA_ENDPOINT
    );
    const wallet = new ethers.Wallet(privateKey, provider);
    const tx = {
      to: receiverAddress,
      value: ethers.parseEther(amount.toString()),
    };
    await wallet.sendTransaction(tx);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: "Invalid form data" };
    }

    return { error: error.message as string };
  }
};
