import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.TALENT_PROTOCOL_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;

  try {
    const response = await axios.get(`https://api.talentprotocol.com/api/v2/passport_credentials`, {
      headers: { "X-API-KEY": `${API_KEY}` },
      params: {
        passport_id: username,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data from Twitter API" });
  }
}
