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

  const leftTop = getLeftTop(addedBallPosition, size);
  const rightBottom = getRightBottom(addedBallPosition, size);
  const diagonal1 = _findFullLineStart(model, leftTop, rightBottom, i => i + size + 1, color, lineLength);
  if (diagonal1.fullLineStart >= 0) {
    return diagonal1;
  }

  const rightTop = getRightTop(addedBallPosition, size);
  const leftBottom = getLeftBottom(addedBallPosition, size);
  const diagonal2 = _findFullLineStart(model, rightTop, leftBottom, i => i + size - 1, color, lineLength);
  if (diagonal2.fullLineStart >= 0) {
    return diagonal2;
  }

  return {
    fullLineStart: -1,
    length: 0,
    next: () => 0,
  };
}

function getLeftTop(position: number, size: number) {
  let p = position;
  let y = p % size;
  let x = (p - y) / size;
  while (y > 0 && x > 0) {
    p = p - size - 1;
    y = p % size;
    x = (p - y) / size;
  }
  return p;
}

function getRightBottom(position: number, size: number) {
  let p = position;
  let y = p % size;
  let x = (p - y) / size;
  while (y < size && x < size) {
    p = p + size + 1;
    y = p % size;
    x = (p - y) / size;
  }
  return p;
}

function getRightTop(position: number, size: number) {
  let p = position;
  let y = p % size;
  let x = (p - y) / size;
  while (y < size && x > 0) {
    p = p - size + 1;
    y = p % size;
    x = (p - y) / size;
  }
  return p;
}

function getLeftBottom(position: number, size: number) {
  let p = position;
  let y = p % size;
  let x = (p - y) / size;
  while (y > 0 && x < size) {
    p = p + size - 1;
    y = p % size;
    x = (p - y) / size;
  }
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
