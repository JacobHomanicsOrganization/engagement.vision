export function getTallyForFilteredArray(
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
