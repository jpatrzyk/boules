declare type NumDict<T> = { [key: number]: T };

export function range(n: number, start: number = 0) {
  const result = Array(n);
  for (let i = start; i < n; i++) {
    result[i] = i;
  }
  return result;
}

export function includesAll<T>(arr: T[], values: T[]): boolean {
  return values.every(val => arr.includes(val));
}

export function findAllKeys<V>(
  obj: NumDict<V>,
  predicate: (key: number, value: V) => boolean,
): number[] {
  const keys = Object.keys(obj).map(k => Number(k));
  return keys.filter(k => predicate(k, obj[k]));
}

export function findKey<V, D extends number | undefined>(
  obj: NumDict<V>,
  predicate: (key: number, value: V) => boolean,
  defaultValue: D,
): D {
  const keys = Object.keys(obj).map(k => Number(k));
  const found = keys.find(k => predicate(k, obj[k]));
  if (found === undefined) {
    return defaultValue;
  }
  return found as D;
}

// min included, max excluded
export function randomInt(min: number, max: number): number {
  const intMin = Math.ceil(min);
  const intMax = Math.ceil(max);
  return Math.floor(Math.random() * (intMax - intMin)) + intMin;
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export function debounce<T, R>(
  func: (...args: T[]) => R,
  delay: number = 300,
): (...args: T[]) => R | void {
  let canInvoke = true;
  function debounced(...args: T[]) {
    if (canInvoke) {
      canInvoke = false;
      setTimeout(() => {
        canInvoke = true;
      }, delay);
      return func(...args);
    }
  }
  return debounced;
}

export function currentDateFormatted(): string {
  // returns current date in format YYYY-MM-DD_HH:mm eg.: 2019-08-02_1040
  return new Date()
    .toISOString()
    .substring(0, 16)
    .replace('T', '_')
    .replace(':', '');
}
