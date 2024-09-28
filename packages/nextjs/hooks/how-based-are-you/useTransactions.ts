import { useEffect, useState } from "react";
import axios from "axios";

const fetchTransactions = async (address: any) => {
  const apiKey = "JNHGAYAJ35A4S981QFATUTGQQS2ZVG4NPY";
  const url = `https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

  const response = await axios.get(url);
  let transactions = response.data.result;

  console.log(transactions);

  if (transactions === "Max calls per sec rate limit reached (5/sec)") {
    transactions = [];
  }

  return transactions;
};

export const useTransactions = ({ address }: any) => {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const getTransactions = async () => {
      const txs = await fetchTransactions(address);
      setTransactions(txs);
    };

    getTransactions();
  }, [address]);

  return transactions;
};
