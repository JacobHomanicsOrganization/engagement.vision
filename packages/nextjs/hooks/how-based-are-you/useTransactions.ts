import { useEffect, useState } from "react";
import axios from "axios";
import * as chains from "viem/chains";

const blockExplorerApiKeys = {
  Ethereum: "PHFIJCVSUQFFEGWMI8M641MJQFFD2WCC7A",
  Base: "JNHGAYAJ35A4S981QFATUTGQQS2ZVG4NPY",
  "Arbitrum One": "MAZ2G1NF8HEHSC6I4JZGKPKYH68AY6MAIT",
  "OP Mainnet": "H2GKEGVRAGMNFNQ14GU5KHAU58PYK1114M",
};

const blockscoutApiUrls = {
  base: "https://base.blockscout.com",
  celo: "https://explorer.celo.org/mainnet",
  optimism: "https://optimism.blockscout.com",
  arbitrum: "https://arbitrum.blockscout.com",
};

export function getBlockscoutExplorerTxLink(chainId: number | undefined, txnHash: string) {
  const chainNames = Object.keys(chains);

  const targetChain = chainNames.find(chainName => {
    const wagmiChain = chains[chainName as keyof typeof chains];
    return wagmiChain.id === chainId;
  });

  if (!targetChain) {
    return "";
  }

  return `${blockscoutApiUrls[targetChain as keyof typeof blockscoutApiUrls]}/tx/${txnHash}`;
}

const blockscoutApiKey = "";

export function getBlockscoutApiLink(chainId: number, address: any) {
  const chainNames = Object.keys(chains);

  const targetChain = chainNames.find(chainName => {
    const wagmiChain = chains[chainName as keyof typeof chains];
    return wagmiChain.id === chainId;
  });

  if (!targetChain) {
    return "";
  }

  return `${
    blockscoutApiUrls[targetChain as keyof typeof blockscoutApiUrls]
  }/api?module=account&action=txlist&address=${address}&sort=asc&apikey=${blockscoutApiKey}`;
}

const routescanApiKey = "YourApiKeyToken";
export function getRoutescanApiLink(chainId: number, address: any) {
  return `https://api.routescan.io/v2/network/mainnet/evm/${chainId}/etherscan/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${routescanApiKey}`;
}

export function getBlockExplorerApiLink(chainId: number, address: any) {
  const chainNames = Object.keys(chains);

  const targetChainArr = chainNames.filter(chainName => {
    const wagmiChain = chains[chainName as keyof typeof chains];
    return wagmiChain.id === chainId;
  });

  if (targetChainArr.length === 0) {
    return "";
  }

  const targetChain = targetChainArr[0] as keyof typeof chains;

  const blockExplorerApiUrl = (chains[targetChain]?.blockExplorers?.default as { apiUrl?: string })?.apiUrl;

  if (!blockExplorerApiUrl) {
    return "";
  }

  const apiKey = blockExplorerApiKeys[chains[targetChain]?.name as keyof typeof blockExplorerApiKeys];

  return `${blockExplorerApiUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}}`;
}

const fetchTransactions = async (chainId: number, address: any) => {
  const url = getBlockscoutApiLink(chainId, address);

  const response = await axios.get(url);

  if (response.status === 200 && response.data.status !== "1") {
    let eMessage;

    if (response.data.result.includes("Invalid API Key (#err2)|")) {
      eMessage = "This chain is not supported. Please try a different chain!"; //Invalid API Key
    }

    if (response.data.result === "Max calls per sec rate limit reached (5/sec)") {
      eMessage = "Too many requests! Please wait a bit and try again.";
    }

    if (response.data.result === "Error! Invalid address format") {
      eMessage = "The address is invalid!";
    }

    if (response.data.message === "No transactions found") {
      eMessage = "No transactions found!";
    }

    return { transactions: [], isError: true, eMessage };
  }

  return { transactions: response.data.result, isError: false };
};

export const useTransactionsFromChains = ({ chains, address }: { chains: chains.Chain[]; address: any }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    const fetchTransactionsFromChains = async () => {
      if (chains === undefined) return;
      if (address === undefined) return;

      const allTransactions: any[] = [];

      let isError = false;
      let errorMessage = "";

      for (let i = 0; i < chains.length; i++) {
        const chain = chains[i];
        const { transactions, isError: isErrorInChain, eMessage } = await fetchTransactions(chain.id, address);
        allTransactions.push({ chain: chains[i], transactions });

        isError = isError && isErrorInChain;
        errorMessage += eMessage;
      }

      setIsError(isError);
      setErrorMessage(errorMessage);
      setTransactions(allTransactions);
    };

    fetchTransactionsFromChains();
  }, [chains, address]);

  return { transactions, isError, errorMessage };
};

export const useTransactions = ({ chainId, address }: any) => {
  const [transactions, setTransactions] = useState([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    const getTransactions = async () => {
      if (chainId === undefined) return;
      if (address === undefined) return;

      const { transactions, isError, eMessage } = await fetchTransactions(chainId, address);

      setTransactions(transactions);
      setIsError(isError);
      setErrorMessage(eMessage);
    };

    getTransactions();
  }, [chainId, address]);

  return { transactions, isError, errorMessage };
};
