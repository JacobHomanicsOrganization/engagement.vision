import { useEffect, useState } from "react";
import axios from "axios";
import * as chains from "viem/chains";

const blockExplorerApiKeys = {
  Ethereum: "PHFIJCVSUQFFEGWMI8M641MJQFFD2WCC7A",
  Base: "JNHGAYAJ35A4S981QFATUTGQQS2ZVG4NPY",
  "Arbitrum One": "MAZ2G1NF8HEHSC6I4JZGKPKYH68AY6MAIT",
  "OP Mainnet": "H2GKEGVRAGMNFNQ14GU5KHAU58PYK1114M",
};

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
  const url = getBlockExplorerApiLink(chainId, address);

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

export const useTransactions = ({ chainId, address }: any) => {
  const [transactions, setTransactions] = useState([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    const getTransactions = async () => {
      console.log(chainId);
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
