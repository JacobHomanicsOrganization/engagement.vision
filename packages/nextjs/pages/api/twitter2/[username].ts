import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;

  try {
    // Step 1: Get user ID from username
    const userResponse = await axios.get(`https://api.twitter.com/2/users/by/username/${username}`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    const userId = userResponse.data.data.id;

    // Step 2: Get tweets from user ID
    const tweetsResponse = await axios.get(`https://api.twitter.com/2/users/${userId}/tweets`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      params: {
        "tweet.fields": "created_at,text",
        max_results: 10, // You can adjust the number of results
      },
    });

    // Step 3: Filter tweets that mention @base
    const filteredTweets = tweetsResponse.data.data.filter((tweet: any) => tweet.text.includes("@base"));

    res.status(200).json(filteredTweets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tweets" });
  }
}
