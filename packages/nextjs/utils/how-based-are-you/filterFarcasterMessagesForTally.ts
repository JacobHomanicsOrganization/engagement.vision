export const FARCASTER_START_EPOCH = 1609459200;
export function getFarcasterDate(timestamp: number) {
  return new Date((FARCASTER_START_EPOCH + timestamp) * 1000);
}

export function isDateWithinYear(date: Date, year: number) {
  const isWithinYear = date.getFullYear() === year;
  return isWithinYear;
}

export function isDateWithinMonth(date: Date, year: number, month: number) {
  const isWithinMonth = date.getMonth() + 1 === month;
  return isDateWithinYear(date, year) && isWithinMonth;
}

export function isDateWithinDay(date: Date, year: number, month: number, day: number) {
  const isWithinDay = date.getDate() === day;
  return isDateWithinYear(date, year) && isDateWithinMonth(date, year, month) && isWithinDay;
}

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

export function getFilteredArray(array: any[], checks: Array<(element: any) => boolean>) {
  return array.filter(element => {
    return checks.every(check => check(element));
  });
}
