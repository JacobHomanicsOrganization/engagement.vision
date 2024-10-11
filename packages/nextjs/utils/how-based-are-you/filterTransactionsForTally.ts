import { getTallyForFilteredArray } from "./getTallyForFilteredArray";

export function getAllTimeTransactionsTally(array: any[], pointsPer: number) {
  return getTallyForFilteredArray(array, pointsPer);
}

export function getYearlyTransactionsTally(array: any[], pointsPer: number, year: number) {
  return getTallyForFilteredArray(array, pointsPer, (element: any) => {
    const date = new Date(element.timeStamp * 1000);
    return date.getFullYear() === year;
  });
}

export function getMonthlyTransactionsTally(array: any[], pointsPer: number, year: number, month: number) {
  return getTallyForFilteredArray(array, pointsPer, (element: any) => {
    const date = new Date(element.timeStamp * 1000);
    return date.getFullYear() === year && date.getMonth() + 1 === month;
  });
}

export function getDailyTransactionsTally(array: any[], pointsPer: number, year: number, month: number, day: number) {
  return getTallyForFilteredArray(array, pointsPer, (element: any) => {
    const date = new Date(element.timeStamp * 1000);

    const isWithinYear = date.getFullYear() === year;
    const isWithinMonth = date.getMonth() + 1 === month;
    const isWithinDay = date.getDate() === day;
    return isWithinYear && isWithinMonth && isWithinDay;
  });
}
