export function range(n: number) {
    const result = Array(n);
    for (let i = 0; i < n; i++) {
        result[i] = i;
    }
    return result;
}
