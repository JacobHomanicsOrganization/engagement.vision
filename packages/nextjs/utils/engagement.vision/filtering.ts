export function getFilteredArrayForSome(array: any[], checks: Array<(element: any) => boolean>) {
  return array.filter(element => {
    return checks.some(check => check(element));
  });
}

export function getFilteredArrayForEvery(array: any[], checks: Array<(element: any) => boolean>) {
  return array.filter(element => {
    return checks.every(check => check(element));
  });
}
