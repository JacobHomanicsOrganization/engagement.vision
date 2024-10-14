export function getFilteredArray(array: any[], checks: Array<(element: any) => boolean>) {
  return array.filter(element => {
    return checks.every(check => check(element));
  });
}
