import findFullLine from './findFullLine';

describe('findFullLine', () => {
  it('should return null if no full line exists', () => {
    // prettier-ignore
    const model = [
      1, 1, 0,
      2, 0, 1,
      1, 0, 1];
    const result = findFullLine(model, 3, 3, 1);
    expect(result).toBeNull();
  });

  it('should return horizontal line start', () => {
    // prettier-ignore
    const model = [
      1, 0, 0,
      2, 2, 0,
      1, 0, 1];
    const result = findFullLine(model, 3, 2, 4);
    expect(result).toEqual([3, 4]);
  });

  it('should return vertical line start', () => {
    // prettier-ignore
    const model = [
      2, 0, 0,
      1, 0, 2,
      1, 0, 1];
    const result = findFullLine(model, 3, 2, 6);
    expect(result).toEqual([3, 6]);
  });

  it('should return top-left diagonal line start', () => {
    // prettier-ignore
    const model = [
      2, 1, 0,
      0, 0, 1,
      2, 0, 0];
    const result = findFullLine(model, 3, 2, 1);
    expect(result).toEqual([1, 5]);
  });

  it('should return top-right diagonal line start', () => {
    // prettier-ignore
    const model = [
      1, 0, 0,
      0, 2, 1,
      2, 0, 0];
    const result = findFullLine(model, 3, 2, 6);
    expect(result).toEqual([4, 6]);
  });
});
