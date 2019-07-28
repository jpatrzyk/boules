export function range(n: number) {
  const result = Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = i;
  }
  return result;
}

// min included, max excluded
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}
