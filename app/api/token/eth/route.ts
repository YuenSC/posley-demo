import { ethers } from "ethers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");
  try {
    if (!address) {
      throw new Error("Address is required");
    }

    const provider = new ethers.JsonRpcProvider(
      `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`
    );
    const eth = await provider.getBalance(address);

    return Response.json(ethers.formatEther(eth));
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
