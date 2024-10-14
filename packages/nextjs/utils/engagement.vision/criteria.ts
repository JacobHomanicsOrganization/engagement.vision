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
