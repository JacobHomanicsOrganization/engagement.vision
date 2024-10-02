import { useTransactions } from "~~/hooks/how-based-are-you/useTransactions";

const TransactionList = ({ address, month, year }: any) => {
  const { transactions } = useTransactions({ address, month, year });

  return (
    <div>
      <h2>
        Transactions for {address} in {month}/{year}
      </h2>
      <ul>
        {transactions.map((tx: any) => (
          <li key={tx.hash}>
            <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer">
              {tx.hash}
            </a>{" "}
            - {new Date(tx.timeStamp * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
