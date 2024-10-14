interface CriteriaDatabase {
  [key: string]: {
    name?: string;
    logo?: string;
    link?: string;
    channels?: string[];
    fids?: number[];
    farcasterChecks?: any[];
    onchainChecks?: any[];
  };
}

export const communitiesConfig: CriteriaDatabase = {
  "engagement.vision": {
    name: "Engagement.Vision",
    logo: "favicon.svg",
    link: "/",
  },
  nouns: {
    name: "Nouns",
    logo: "noggles.svg",
    link: "/nouns/welcome",
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
  base: {
    name: "Base",
    logo: "Base_Network_Logo.svg",
    link: "/base/welcome",
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
    name: "Ethereum",
    logo: "ethereum-eth.svg",
    link: "/ethereum/welcome",
    onchainChecks: ["date"],
  },
  arbitrum: {
    name: "Arbitrum",
    logo: "arbitrum-arb-logo.png",
    link: "/arbitrum/welcome",
    onchainChecks: ["date"],
  },
  optimism: {
    name: "Optimism",
    logo: "optimism-ethereum-op-logo.png",
    link: "/optimism/welcome",
    farcasterChecks: [
      {
        mentions: [
          300898, //Optimism
        ],
      },
    ],
    onchainChecks: ["date"],
  },
};
