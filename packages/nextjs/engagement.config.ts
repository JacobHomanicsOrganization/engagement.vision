interface CriteriaDatabase {
  [key: string]: {
    name?: string;
    logo?: any;
    link?: string;
    themes?: {
      light?: string;
      dark?: string;
    };
    welcomeCards?: {
      title?: string;
      callToAction?: string;
    };
    chainName?: string;
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
    welcomeCards: {
      title: "How Nounish Are You? ⌐◨-◨",
      callToAction: "Find Out How ⌐◨-◨ Nounish ⌐◨-◨ You Are!",
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
    chainName: "base",
    logo: "Base_Network_Logo.svg",
    link: "/base/welcome",
    themes: {
      light: "lightBase",
      dark: "darkBase",
    },
    welcomeCards: {
      title: "How Based Are You?",
      callToAction: "Find Out How Based You Are!",
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

  optimismFractal: {
    name: "Optimism Fractal",
    logo: "optimism-fractal.jpg",
    link: "/optimismFractal/welcome",
    themes: {
      light: "lightOptimismFractal",
      dark: "darkOptimismFractal",
    },
    welcomeCards: {
      title: "How Fractalized Are You?",
      callToAction: "Find out how Fractalized you are!",
    },
    farcasterChecks: [
      {
        channels: ["https://warpcast.com/~/channel/optimismFractal", "https://warpcast.com/~/channel/optimism"],
      },
      {
        mentions: [
          225840, //Optimism Fractal
          194286, // Rosemari
          211935, // Dan Singjoy
          18484, // Hats Protocol
        ],
      },
    ],
  },
  optimism: {
    name: "Optimism",
    chainName: "optimism",
    logo: "optimism-ethereum-op-logo.png",
    link: "/optimism/welcome",
    themes: {
      light: "lightOptimism",
      dark: "darkOptimism",
    },
    welcomeCards: {
      title: "How Optimistic Are You?",
      callToAction: "Find out how Optimistic you are!",
    },
    farcasterChecks: [
      {
        channels: ["https://warpcast.com/~/channel/op-stack", "https://warpcast.com/~/channel/optimism"],
      },
      {
        mentions: [
          300898, //Optimism
        ],
      },
    ],
    onchainChecks: ["date"],
  },
  ethereum: {
    name: "Ethereum",
    chainName: "mainnet",
    logo: "ethereum-eth.svg",
    link: "/ethereum/welcome",
    themes: {
      light: "lightMainnet",
      dark: "darkMainnet",
    },
    welcomeCards: {
      title: "How Programmable Are You?",
      callToAction: "Find out how Programmable you are!",
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
    welcomeCards: {
      title: "How Stylized Are You?",
      callToAction: "Find out how Stylized you are!",
    },
    onchainChecks: ["date"],
  },
};
