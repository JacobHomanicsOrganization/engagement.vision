import { getTallyForFilteredArray } from "./getTallyForFilteredArray";

export function getAllTimeOnchainTransactionsTally(array: any[], pointsPer: number) {
  return getTallyForFilteredArray(array, pointsPer);
}

export function getYearlyOnchainTransactionsTally(array: any[], pointsPer: number, year: number) {
  return getTallyForFilteredArray(array, pointsPer, (element: any) => {
    const date = new Date(element.timeStamp * 1000);
    return date.getFullYear() === year;
  });
}

export function getMonthlyOnchainTransactionsTally(array: any[], pointsPer: number, year: number, month: number) {
  return getTallyForFilteredArray(array, pointsPer, (element: any) => {
    const date = new Date(element.timeStamp * 1000);
    return date.getFullYear() === year && date.getMonth() + 1 === month;
  });
}

export function getDailyOnchainTransactionsTally(
  array: any[],
  pointsPer: number,
  year: number,
  month: number,
  day: number,
) {
  return getTallyForFilteredArray(array, pointsPer, (element: any) => {
    const date = new Date(element.timeStamp * 1000);

    const isWithinYear = date.getFullYear() === year;
    const isWithinMonth = date.getMonth() + 1 === month;
    const isWithinDay = date.getDate() === day;
    return isWithinYear && isWithinMonth && isWithinDay;
  });
}
