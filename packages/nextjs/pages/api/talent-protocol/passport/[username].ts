import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.TALENT_PROTOCOL_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;

  try {
    const response = await axios.get(`https://api.talentprotocol.com/api/v2/passports/${username}`, {
      headers: { "X-API-KEY": `${API_KEY}` },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(200).json({ error: "Error fetching data from TALENT PROTOCOL API" });
  }
}
