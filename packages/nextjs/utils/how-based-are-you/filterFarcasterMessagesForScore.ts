import { Chain } from "viem";

const chainsObjs = {
  Base: {
    mentionFids: [
      12142, //Base,
      309857, //Coinbase Wallet
    ],
  },
};

export function getFarcasterMessagesTally(
  transactions: any,
  pointsPer: number,
  filterFn: (tx: any) => boolean = () => {
    return true;
  },
) {
  const filteredTransactions = transactions.filter(filterFn) as any;

  let score = 0;

  for (let i = 0; i < filteredTransactions.length; i++) {
    score += pointsPer;
  }

  return score;
}

export function getAllTimeFarcasterMessagesTally(transactions: any, pointsPer: number, chain: Chain) {
  return getFarcasterMessagesTally(transactions, pointsPer, (tx: any) => {
    let isPresent = false;

    for (let i = 0; i < tx.data.castAddBody?.mentions.length; i++) {
      for (let j = 0; j < chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids.length; j++) {
        if (tx.data.castAddBody.mentions[i] === chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids[j]) {
          isPresent = true;
        }
      }
    }
    return isPresent;
  }) as any;
}

export function getYearlyTransactionsTally(transactions: any, pointsPer: number, year: number) {
  return getFarcasterMessagesTally(transactions, pointsPer, (tx: any) => {
    const txDate = new Date(tx.timeStamp * 1000);
    return txDate.getFullYear() === year;
  });
}

export function getMonthlyTransactionsTally(transactions: any, pointsPer: number, year: number, month: number) {
  return getFarcasterMessagesTally(transactions, pointsPer, (tx: any) => {
    const txDate = new Date(tx.timeStamp * 1000);
    return txDate.getFullYear() === year && txDate.getMonth() + 1 === month;
  });
}

export function getDailyTransactionsTally(
  transactions: any,
  pointsPer: number,
  year: number,
  month: number,
  day: number,
) {
  return getFarcasterMessagesTally(transactions, pointsPer, (tx: any) => {
    const txDate = new Date(tx.timeStamp * 1000);

    const isWithinYear = txDate.getFullYear() === year;
    const isWithinMonth = txDate.getMonth() + 1 === month;
    const isWithinDay = txDate.getDate() === day;
    return isWithinYear && isWithinMonth && isWithinDay;
  }) as any;
}