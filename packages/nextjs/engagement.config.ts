interface CriteriaDatabase {
  [key: string]: {
    name?: string;
    logo?: any;
    link?: string;
    themes?: {
      light?: string;
      dark?: string;
    };
    channels?: string[];
    fids?: number[];
    farcasterChecks?: any[];
    onchainChecks?: any[];
  };
}

function getProperGlasses(isDarkMode: boolean) {
  return isDarkMode ? "meeple-circle-white.png" : "meeple-circle.png";
}

export const communitiesConfig: CriteriaDatabase = {
  "engagement.vision": {
    name: "Engagement.Vision",
    logo: (isDarkMode: boolean) => {
      return getProperGlasses(isDarkMode);
    },
    link: "/",
    themes: {
      light: "light",
      dark: "dark",
    },
  },
  nouns: {
    name: "Nouns",
    logo: "noggles.svg",
    link: "/nouns/welcome",
    themes: {
      light: "lightNouns",
      dark: "darkNouns",
    },
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
    themes: {
      light: "lightBase",
      dark: "darkBase",
    },
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
    themes: {
      light: "lightMainnet",
      dark: "darkMainnet",
    },
    onchainChecks: ["date"],
  },
  arbitrum: {
    name: "Arbitrum",
    logo: "arbitrum-arb-logo.png",
    link: "/arbitrum/welcome",
    themes: {
      light: "lightArbitrum",
      dark: "darkArbitrum",
    },
    onchainChecks: ["date"],
  },
  optimism: {
    name: "Optimism",
    logo: "optimism-ethereum-op-logo.png",
    link: "/optimism/welcome",
    themes: {
      light: "lightOptimism",
      dark: "darkOptimism",
    },
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
