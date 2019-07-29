import findPath from './findPath';

describe('findPath', () => {
  it('should find shortest path on empty board', () => {
    // prettier-ignore
    const model = [
      0, 0, 0,
      0, 0, 0,
      0, 0, 0];
    const size = 3;
    const path = findPath(0, 6, model, size); // from (0,0) to (2,0)
    expect(path).toEqual([3, 6]); // [(1,0), (2,0)]
  });

  it('should return null if there is no path', () => {
    // prettier-ignore
    const model = [
      0, 0, 0,
      1, 1, 1,
      0, 0, 0];
    const size = 3;
    const path = findPath(0, 6, model, size); // from (0,0) to (2,0)
    expect(path).toBeNull();
  });

  it('should find shortest path bypassing existing balls', () => {
    // prettier-ignore
    const model = [
      0, 0, 0,
      1, 1, 0,
      0, 0, 0];
    const size = 3;
    const path = findPath(0, 6, model, size); // from (0,0) to (2,0)
    expect(path).toEqual([1, 2, 5, 8, 7, 6]); // [(0,1), (0,2), (1,2), (2,2), (2,1), (2,0)]
  });

  it('should return null if the destination is not empty', () => {
    // prettier-ignore
    const model = [
      0, 0, 0,
      0, 0, 0,
      2, 0, 0];
    const size = 3;
    const path = findPath(0, 6, model, size); // from (0,0) to (2,0)
    expect(path).toBeNull();
  });

  it('should return empty array if origin === destination', () => {
    // prettier-ignore
    const model = [
      0, 3, 0,
      0, 0, 0,
      0, 0, 0];
    const size = 3;
    const path = findPath(1, 1, model, size); // from (0,1) to (0,1)
    expect(path).toEqual([]);
  });
});
