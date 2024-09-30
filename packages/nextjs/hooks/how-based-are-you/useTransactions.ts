import { useEffect, useState } from "react";
import axios from "axios";
import * as chains from "viem/chains";

const blockExplorerApiKeys = {
  Base: "JNHGAYAJ35A4S981QFATUTGQQS2ZVG4NPY",
  "Arbitrum One": "MAZ2G1NF8HEHSC6I4JZGKPKYH68AY6MAIT",
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

  console.log(chains[targetChain]?.name);

  const apiKey = blockExplorerApiKeys[chains[targetChain]?.name as keyof typeof blockExplorerApiKeys];

  return `${blockExplorerApiUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}}`;
}

const fetchTransactions = async (chainId: number, address: any) => {
  const url = getBlockExplorerApiLink(chainId, address);

  console.log(url);
  const response = await axios.get(url);
  let transactions = response.data.result;

  console.log(transactions);

  if (transactions === "Max calls per sec rate limit reached (5/sec)") {
    transactions = [];
  }

  return transactions;
};

export const useTransactions = ({ chainId, address }: any) => {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const getTransactions = async () => {
      const txs = await fetchTransactions(chainId, address);
      setTransactions(txs);
    };

    getTransactions();
  }, [chainId, address]);

  return transactions;
};
