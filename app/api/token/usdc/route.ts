import { ethers } from "ethers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");
  try {
    if (!address) {
      throw new Error("Address is required");
    }

    const provider = new ethers.JsonRpcProvider(process.env.INFURA_ENDPOINT);

    const usdcContract = new ethers.Contract(
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      ["function balanceOf(address) view returns (uint256)"],
      provider
    );
    const usdc = await usdcContract.balanceOf(address);

    return Response.json(ethers.formatUnits(usdc, 6));
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
