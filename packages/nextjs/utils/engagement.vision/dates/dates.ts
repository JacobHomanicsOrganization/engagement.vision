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
