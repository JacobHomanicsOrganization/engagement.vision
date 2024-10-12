// import { getTallyForFilteredArray } from "./getTallyForFilteredArray";

export function getYearlyOnchainTransactions(array: any[], year: number) {
  return array.filter(element => {
    const date = new Date(element.timeStamp * 1000);
    return date.getFullYear() === year;
  });
}

export function getMonthlyOnchainTransactions(array: any[], year: number, month: number) {
  return array.filter(element => {
    const date = new Date(element.timeStamp * 1000);
    return date.getFullYear() === year && date.getMonth() + 1 === month;
  });
}

export function getDailyOnchainTransactions(array: any[], year: number, month: number, day: number) {
  return array.filter(element => {
    const date = new Date(element.timeStamp * 1000);

    const isWithinYear = date.getFullYear() === year;
    const isWithinMonth = date.getMonth() + 1 === month;
    const isWithinDay = date.getDate() === day;
    return isWithinYear && isWithinMonth && isWithinDay;
  });
}

export function getAllTimeOnchainTransactionsTally(array: any[], pointsPer: number) {
  return array.length * pointsPer;
}

export function getYearlyOnchainTransactionsTally(array: any[], pointsPer: number, year: number) {
  return getYearlyOnchainTransactions(array, year).length * pointsPer;

  // return getTallyForFilteredArray(array, pointsPer, (element: any) => {
  //   const date = new Date(element.timeStamp * 1000);
  //   return date.getFullYear() === year;
  // });
}

export function getMonthlyOnchainTransactionsTally(array: any[], pointsPer: number, year: number, month: number) {
  return getMonthlyOnchainTransactions(array, year, month).length * pointsPer;

  // return getTallyForFilteredArray(array, pointsPer, (element: any) => {
  //   const date = new Date(element.timeStamp * 1000);
  //   return date.getFullYear() === year && date.getMonth() + 1 === month;
  // });
}

export function getDailyOnchainTransactionsTally(
  array: any[],
  pointsPer: number,
  year: number,
  month: number,
  day: number,
) {
  return getDailyOnchainTransactions(array, year, month, day).length * pointsPer;

  // return getTallyForFilteredArray(array, pointsPer, (element: any) => {
  //   const date = new Date(element.timeStamp * 1000);

  //   const isWithinYear = date.getFullYear() === year;
  //   const isWithinMonth = date.getMonth() + 1 === month;
  //   const isWithinDay = date.getDate() === day;
  //   return isWithinYear && isWithinMonth && isWithinDay;
  // });
}
