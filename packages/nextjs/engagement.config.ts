import { GitcoinLogo } from "./components/assets/Gitcoin";

interface CriteriaDatabase {
  [key: string]: {
    name?: string;
    logo?: any;
    logoJs?: any;
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
    chains?: any[];
    channels?: string[];
    fids?: number[];
    farcasterChecks?: any[];
    onchainChecks?: any[];
    followerChecks?: any[];
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
  gitcoin: {
    name: "Gitcoin",
    logoJs: GitcoinLogo,
    chains: [{ id: 42220 }],
    onchainChecks: ["date"],
    link: "/gitcoin/welcome",
    themes: {
      light: "lightGitcoin",
      dark: "darkGitcoin",
    },
    welcomeCards: {
      title: "Are you engaged with Gitcoin?",
      callToAction: "Find out how engaged you are!",
    },
    farcasterChecks: [
      {
        text: ["Gitcoin"],
      },
    ],
  },
  raidguildcohortvii: {
    name: "Raid Guild - Cohort VII",
    logo: "raidguild.svg",
    link: "/raidguildcohortvii/welcome",
    themes: {
      light: "lightRaidGuildCohortVII",
      dark: "darkRaidGuildCohortVII",
    },
    welcomeCards: {
      title: "Are you engaged with the Raid Guild Cohort VII?",
      callToAction: "Find out how engaged you are!",
    },
    farcasterChecks: [
      {
        text: ["Cohort VII"],
        mentions: [383235],
      },
    ],
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
    chains: [{ id: 8453 }],
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
        mentions: [
          12142, //Base,
          309857, //Coinbase Wallet
          20910, //Zora
        ],
      },
    ],
    followerChecks: ["date"],
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
    chains: [{ id: 10 }],
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
        mentions: [
          300898, //Optimism
        ],
      },
    ],
    followerChecks: ["date"],

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
    followerChecks: ["date"],
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
  mode: {
    name: "Mode Network",
    logo: "mode.svg",
    link: "/mode/welcome",
    // chainName: "mode",
    themes: {
      light: "lightMode",
      dark: "darkMode",
    },
    welcomeCards: {
      title: "Are you scaling Defi with AIFi?",
      callToAction: "Find out now!",
    },
    farcasterChecks: [
      {
        channels: ["https://warpcast.com/~/channel/mode"],
      },
      {
        mentions: [
          217750, //Mode
        ],
      },
    ],
    followerChecks: ["date"],

    onchainChecks: ["date"],
  },
};
