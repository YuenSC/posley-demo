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

    const usdtContract = new ethers.Contract(
      "0xdac17f958d2ee523a2206206994597c13d831ec7",
      ["function balanceOf(address) view returns (uint256)"],
      provider
    );
    const usdt = await usdtContract.balanceOf(address);

    return Response.json(ethers.formatUnits(usdt, 6));
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
