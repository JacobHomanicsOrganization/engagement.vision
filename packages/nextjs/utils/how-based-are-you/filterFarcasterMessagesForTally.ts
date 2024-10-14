// import { getTallyForFilteredArray } from "./getTallyForFilteredArray";

const FARCASTER_START_EPOCH = 1609459200;

export function isValueInCriteria<T>(criteria: T[], value: T): boolean {
  let isPresent = false;

  for (let j = 0; j < criteria.length; j++) {
    if (value === criteria[j]) {
      isPresent = true;
    }
  }

  return isPresent;
}

export function areAnyValuesInCriteria<T>(criteria: T[], values: T[] = []): boolean {
  return values.some(value => isValueInCriteria(criteria, value));
}

export function getFarcasterDate(farcasterMessageTimestamp: number) {
  return new Date((FARCASTER_START_EPOCH + farcasterMessageTimestamp) * 1000);
}

export function isWithinYear(date: Date, year: number) {
  // const date = getFarcasterDate(farcasterMessageTimestamp);
  return date.getFullYear() === year;
}

export function isWithinMonth(date: Date, year: number, month: number) {
  // const date = getFarcasterDate(farcasterMessageTimestamp);
  return date.getFullYear() === year && date.getMonth() + 1 === month;
}

export function isWithinDay(date: Date, year: number, month: number, day: number) {
  // const date = getFarcasterDate(farcasterMessageTimestamp);
  return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
}

export function getFilteredArray(array: any[], checks: Array<(element: any) => boolean>) {
  return array.filter(element => {
    return checks.every(check => check(element));
  });
}
