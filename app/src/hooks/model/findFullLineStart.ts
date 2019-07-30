export default function findFullLineStart(
  model: number[],
  size: number,
  lineLength: number,
  addedBallPosition: number,
) {
  const color = model[addedBallPosition];

  const rowStart = addedBallPosition - (addedBallPosition % size);
  const rowEnd = rowStart + size - 1;
  const horizontal = _findFullLineStart(model, rowStart, rowEnd, i => i + 1, color, lineLength);
  if (horizontal.fullLineStart >= 0) {
    return horizontal;
  }

  const columnStart = addedBallPosition % size;
  const columnEnd = columnStart + (size - 1) * size;
  const vertical = _findFullLineStart(model, columnStart, columnEnd, i => i + size, color, lineLength);
  if (vertical.fullLineStart >= 0) {
    return vertical;
  }

  const goLeftUp = (i: number) => i - size - 1;
  const goRightDown = (i: number) => i + size + 1;
  const leftTop = _getDiagonalCorner(addedBallPosition, size, goLeftUp);
  const rightBottom = _getDiagonalCorner(addedBallPosition, size, goRightDown);
  const diagonal1 = _findFullLineStart(model, leftTop, rightBottom, goRightDown, color, lineLength);
  if (diagonal1.fullLineStart >= 0) {
    return diagonal1;
  }

  const goRightUp = (i: number) => i - size + 1;
  const goLeftDown = (i: number) => i + size - 1;
  const rightTop = _getDiagonalCorner(addedBallPosition, size, goRightUp);
  const leftBottom = _getDiagonalCorner(addedBallPosition, size, goLeftDown);
  const diagonal2 = _findFullLineStart(model, rightTop, leftBottom, goLeftDown, color, lineLength);
  if (diagonal2.fullLineStart >= 0) {
    return diagonal2;
  }

  return {
    fullLineStart: -1,
    length: 0,
    next: () => 0,
  };
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
    return {
      fullLineStart: maxStart,
      length: maxSubsequentCount,
      next,
    };
  }
  return {
    fullLineStart: -1,
    length: 0,
    next,
  };
}
