export default function findFullLine(
  model: number[],
  size: number,
  lineLength: number,
  addedBallPosition: number,
): number[] | null {
  const color = model[addedBallPosition];

  const goRight = (i: number) => i + 1;
  const rowStart = addedBallPosition - (addedBallPosition % size);
  const rowEnd = rowStart + size - 1;
  const horizontal = _findFullLineStart(model, rowStart, rowEnd, goRight, color, lineLength);
  if (horizontal >= 0) {
    return _findFullLine(model, horizontal, goRight);
  }

  const goDown = (i: number) => i + size;
  const columnStart = addedBallPosition % size;
  const columnEnd = columnStart + (size - 1) * size;
  const vertical = _findFullLineStart(
    model,
    columnStart,
    columnEnd,
    goDown,
    color,
    lineLength,
  );
  if (vertical >= 0) {
    return _findFullLine(model, vertical, goDown);
  }

  const goLeftUp = (i: number) => i - size - 1;
  const goRightDown = (i: number) => i + size + 1;
  const leftTop = _getDiagonalCorner(addedBallPosition, size, goLeftUp);
  const rightBottom = _getDiagonalCorner(addedBallPosition, size, goRightDown);
  const diagonal1 = _findFullLineStart(model, leftTop, rightBottom, goRightDown, color, lineLength);
  if (diagonal1 >= 0) {
    return _findFullLine(model, diagonal1, goRightDown);
  }

  const goRightUp = (i: number) => i - size + 1;
  const goLeftDown = (i: number) => i + size - 1;
  const rightTop = _getDiagonalCorner(addedBallPosition, size, goRightUp);
  const leftBottom = _getDiagonalCorner(addedBallPosition, size, goLeftDown);
  const diagonal2 = _findFullLineStart(model, rightTop, leftBottom, goLeftDown, color, lineLength);
  if (diagonal2 >= 0) {
    return _findFullLine(model, diagonal2, goLeftDown);
  }

  return null;
}

function _getDiagonalCorner(position: number, size: number, next: (p: number) => number): number {
  let p, x, y;
  let next_p = position;
  do {
    p = next_p;
    next_p = next(next_p);
    y = next_p % size;
    x = (next_p - y) / size;
  } while (x >= 0 && y >= 0 && x < size && y < size);
  return p;
}

function _findFullLineStart(
  model: number[],
  begin: number,
  end: number,
  next: (i: number) => number,
  color: number,
  lineLength: number,
) {
  let subsequentCount = 0;
  let maxSubsequentCount = 0;
  let start = begin;
  let maxStart = begin;
  let i = begin;
  while (true) {
    if (model[i] === color) {
      subsequentCount++;
      if (subsequentCount > maxSubsequentCount) {
        maxSubsequentCount = subsequentCount;
        maxStart = start;
      }
    } else {
      subsequentCount = 0;
      start = next(i);
    }
    if (i === end) {
      break;
    }
    i = next(i);
  }
  if (maxSubsequentCount >= lineLength) {
    return maxStart;
  }
  return -1;
}

function _findFullLine(model: number[], start: number, next: (i: number) => number): number[] {
  const result = [];
  let i = start;
  while (model[i] === model[start]) {
    result.push(i);
    i = next(i);
  }
  return result;
}
