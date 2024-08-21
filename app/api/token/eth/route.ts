import { ethers } from "ethers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");
  const providerType = searchParams.get("providerType");
  const providerUrl =
    providerType === "linea"
      ? process.env.INFURA_LINEA_SEPOLIA_ENDPOINT
      : process.env.INFURA_ENDPOINT;

  try {
    if (!address) {
      throw new Error("Address is required");
    }

    const provider = new ethers.JsonRpcProvider(providerUrl);

    const network = await provider.getNetwork();
    const eth = await provider.getBalance(address);

    return Response.json(ethers.formatEther(eth));
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
