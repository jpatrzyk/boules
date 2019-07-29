import findFullLineStart from './findFullLineStart';

describe('findFullLineStart', () => {
  it('should return -1 if no full line exists', () => {
    // prettier-ignore
    const model = [
      1, 1, 0,
      2, 0, 1,
      1, 0, 1];
    const { fullLineStart } = findFullLineStart(model, 3, 3, 1);
    expect(fullLineStart).toBe(-1);
  });

  it('should return horizontal line start', () => {
    // prettier-ignore
    const model = [
      1, 0, 0,
      2, 2, 0,
      1, 0, 1];
    const { fullLineStart } = findFullLineStart(model, 3, 2, 4);
    expect(fullLineStart).toBe(3);
  });

  it('should return vertical line start', () => {
    // prettier-ignore
    const model = [
      2, 0, 0,
      1, 0, 2,
      1, 0, 1];
    const { fullLineStart } = findFullLineStart(model, 3, 2, 6);
    expect(fullLineStart).toBe(3);
  });

  it('should return top-left diagonal line start', () => {
    // prettier-ignore
    const model = [
      2, 1, 0,
      0, 0, 1,
      2, 0, 0];
    const { fullLineStart } = findFullLineStart(model, 3, 2, 1);
    expect(fullLineStart).toBe(1);
  });

  it('should return top-right diagonal line start', () => {
    // prettier-ignore
    const model = [
      1, 0, 0,
      0, 2, 1,
      2, 0, 0];
    const { fullLineStart } = findFullLineStart(model, 3, 2, 6);
    expect(fullLineStart).toBe(4);
  });
});