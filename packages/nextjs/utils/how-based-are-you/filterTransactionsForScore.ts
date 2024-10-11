export function getTransactionsScore(
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

export function getAllTimeTransactionsPoints(transactions: any, pointsPer: number) {
  return getTransactionsScore(transactions, pointsPer);
}

export function getYearlyTransactionsPoints(transactions: any, pointsPer: number, year: number) {
  return getTransactionsScore(transactions, pointsPer, (tx: any) => {
    const txDate = new Date(tx.timeStamp * 1000);
    return txDate.getFullYear() === year;
  });
}

export function getMonthlyTransactionsPoints(transactions: any, pointsPer: number, year: number, month: number) {
  return getTransactionsScore(transactions, pointsPer, (tx: any) => {
    const txDate = new Date(tx.timeStamp * 1000);
    return txDate.getFullYear() === year && txDate.getMonth() + 1 === month;
  });
}

export function getDailyTransactionsPoints(
  transactions: any,
  pointsPer: number,
  year: number,
  month: number,
  day: number,
) {
  return getTransactionsScore(transactions, pointsPer, (tx: any) => {
    const txDate = new Date(tx.timeStamp * 1000);

    const isWithinYear = txDate.getFullYear() === year;
    const isWithinMonth = txDate.getMonth() + 1 === month;
    const isWithinDay = txDate.getDate() === day;
    return isWithinYear && isWithinMonth && isWithinDay;
  }) as any;
}
