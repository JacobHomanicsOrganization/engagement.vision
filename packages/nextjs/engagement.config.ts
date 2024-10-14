interface CriteriaDatabase {
  [key: string]: {
    channels?: string[];
    fids?: number[];
    farcasterChecks?: any[];
    onchainChecks?: any[];
  };
}

export const criteriaDatabase: CriteriaDatabase = {
  base: {
    farcasterChecks: [
      {
        channels: [
          "https://onchainsummer.xyz",
          "https://warpcast.com/~/channel/base-builds",
          "https://warpcast.com/~/channel/coinbase",
        ],
      },
      {
        mentions: [
          12142, //Base,
          309857, //Coinbase Wallet
          20910, //Zora
        ],
      },
    ],
    onchainChecks: ["date"],
  },
  ethereum: {
    onchainChecks: ["date"],
  },
  arbitrum: {
    onchainChecks: ["date"],
  },
  optimism: {
    farcasterChecks: [
      {
        mentions: [
          300898, //Optimism
        ],
      },
    ],
    onchainChecks: ["date"],
  },
  nouns: {
    farcasterChecks: [
      {
        channels: ["chain://eip155:1/erc721:0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03"],
      },
      {
        mentions: [
          2375, //Nouns,
          749097, //nounstown.eth
        ],
      },
    ],
  },
};
