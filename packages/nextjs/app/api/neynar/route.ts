import { NextResponse } from "next/server";
import neynarClient from "~~/services/neynar/client";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    const channels = await neynarClient.fetchBulkUsersByEthereumAddress([address || ""]);

    return NextResponse.json(channels, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
};
