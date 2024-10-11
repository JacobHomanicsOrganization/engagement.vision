import { getTallyForFilteredArray } from "./getTallyForFilteredArray";

export function getAllTimeBadgesTally(array: any[], pointsPer: number) {
  return getTallyForFilteredArray(array, pointsPer, (element: any) => {
    return element["onchain_at"] !== null;
  });
}

export function getYearlyBadgesTally(array: any[], pointsPer: number, year: number) {
  return getTallyForFilteredArray(array, pointsPer, (element: any) => {
    const date = new Date(element["onchain_at"]);
    return date.getFullYear() === year;
  });
}

export function getMonthlyBadgesTally(array: any[], pointsPer: number, year: number, month: number) {
  return getTallyForFilteredArray(array, pointsPer, (element: any) => {
    const date = new Date(element["onchain_at"]);
    return date.getFullYear() === year && date.getMonth() + 1 === month;
  });
}

export function getDailyBadgesTally(array: any[], pointsPer: number, year: number, month: number, day: number) {
  return getTallyForFilteredArray(array, pointsPer, (element: any) => {
    const date = new Date(element["onchain_at"]);
    return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
  });
}
