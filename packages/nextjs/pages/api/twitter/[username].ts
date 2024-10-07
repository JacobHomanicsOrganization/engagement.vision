import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;

  try {
    const response = await axios.get(`https://api.twitter.com/2/users/by/username/${username}`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data from Twitter API" });
  }
}
