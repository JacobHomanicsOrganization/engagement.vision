import { NextResponse } from "next/server";
import neynarClient from "~~/services/neynar/client";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    const users = await neynarClient.fetchBulkUsersByEthereumAddress([address || ""]);

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    if (error.message === "Request failed with status code 404") {
      return NextResponse.json({ error: (error as Error).message }, { status: 200 });
    } else {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  }
};
