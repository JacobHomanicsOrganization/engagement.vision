import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;

  try {
    //https://fnames.farcaster.xyz/transfers/current?name=${username}
    //https://api.farcaster.xyz/v2/user-by-fname?fname=${username}
    const response = await axios.get(`https://fnames.farcaster.xyz/transfers/current?name=${username}`);
    res.status(200).json(response.data.transfer.id);
    // return response.data.transfer.id;
  } catch (err) {
    console.log(err);
  }
}
