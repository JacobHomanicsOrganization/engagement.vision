export function getTransactionsTally(
  transactions: [],
  pointsPer: number,
  filterFn: (tx: any) => boolean = () => {
    return true;
  },
) {
  const filteredTransactions = transactions.filter(filterFn) as any;

  let tally = 0;

  for (let i = 0; i < filteredTransactions.length; i++) {
    tally += pointsPer;
  }

  return tally;
}

export function getAllTimeTransactionsTally(transactions: [], pointsPer: number) {
  return getTransactionsTally(transactions, pointsPer);
}

export function getYearlyTransactionsTally(transactions: [], pointsPer: number, year: number) {
  return getTransactionsTally(transactions, pointsPer, (tx: any) => {
    const txDate = new Date(tx.timeStamp * 1000);
    return txDate.getFullYear() === year;
  });
}

export function getMonthlyTransactionsTally(transactions: [], pointsPer: number, year: number, month: number) {
  return getTransactionsTally(transactions, pointsPer, (tx: any) => {
    const txDate = new Date(tx.timeStamp * 1000);
    return txDate.getFullYear() === year && txDate.getMonth() + 1 === month;
  });
}

export function getDailyTransactionsTally(
  transactions: [],
  pointsPer: number,
  year: number,
  month: number,
  day: number,
) {
  return getTransactionsTally(transactions, pointsPer, (tx: any) => {
    const txDate = new Date(tx.timeStamp * 1000);

    const isWithinYear = txDate.getFullYear() === year;
    const isWithinMonth = txDate.getMonth() + 1 === month;
    const isWithinDay = txDate.getDate() === day;
    return isWithinYear && isWithinMonth && isWithinDay;
  }) as any;
}
