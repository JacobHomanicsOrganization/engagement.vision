import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { fid, nextPageToken } = req.query;

  try {
    const response = await axios.get(
      `https://hub.pinata.cloud/v1/castsByFid?fid=${fid}&reverse=true&nextPageToken=${nextPageToken}`,
    );

    res.status(200).json(response.data);

    // return response.data;
  } catch (err) {
    console.log(err);
  }
}
