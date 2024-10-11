export function getTallyForFilteredArray(
  array: any[],
  pointsPer: number,
  filterFn: (element: any) => boolean = () => {
    return true;
  },
) {
  const filteredArray = array.filter(filterFn) as any;
  return filteredArray.length * pointsPer;
}
