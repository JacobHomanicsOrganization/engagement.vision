export function getTransactionsTally(
  array: [],
  pointsPer: number,
  filterFn: (element: any) => boolean = () => {
    return true;
  },
) {
  const filteredArray = array.filter(filterFn) as any;

  let tally = 0;

  for (let i = 0; i < filteredArray.length; i++) {
    tally += pointsPer;
  }

  return tally;
}

export function getAllTimeTransactionsTally(array: [], pointsPer: number) {
  return getTransactionsTally(array, pointsPer);
}

export function getYearlyTransactionsTally(array: [], pointsPer: number, year: number) {
  return getTransactionsTally(array, pointsPer, (element: any) => {
    const date = new Date(element.timeStamp * 1000);
    return date.getFullYear() === year;
  });
}

export function getMonthlyTransactionsTally(array: [], pointsPer: number, year: number, month: number) {
  return getTransactionsTally(array, pointsPer, (element: any) => {
    const date = new Date(element.timeStamp * 1000);
    return date.getFullYear() === year && date.getMonth() + 1 === month;
  });
}

export function getDailyTransactionsTally(array: [], pointsPer: number, year: number, month: number, day: number) {
  return getTransactionsTally(array, pointsPer, (element: any) => {
    const date = new Date(element.timeStamp * 1000);

    const isWithinYear = date.getFullYear() === year;
    const isWithinMonth = date.getMonth() + 1 === month;
    const isWithinDay = date.getDate() === day;
    return isWithinYear && isWithinMonth && isWithinDay;
  });
}
