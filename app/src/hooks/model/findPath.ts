export default function findPath(
  fromPosition: number,
  toPosition: number,
  model: number[],
  size: number,
): number[] | null {
  if (fromPosition === toPosition) {
    return [];
  }
  if (model[toPosition] > 0) {
    return null;
  }

  const positionsToCheck = [fromPosition];
  const backWay: number[] = [];
  backWay[fromPosition] = -1;
  let nextToCheck = 0;
  const visited: boolean[] = [];
  visited[fromPosition] = true;

  while (nextToCheck < positionsToCheck.length) {
    let startingPosition = positionsToCheck[nextToCheck];
    if (startingPosition === toPosition) {
      const path = [toPosition];
      let prevPositionOnPath = backWay[toPosition];
      while (prevPositionOnPath !== fromPosition) {
        path.push(prevPositionOnPath);
        prevPositionOnPath = backWay[prevPositionOnPath];
      }
      return path.reverse();
    }
    let candidate = startingPosition - size; // upper cell
    if (candidate >= 0 && model[candidate] === 0 && !visited[candidate]) {
      // upper cell exists, is empty & not visited
      positionsToCheck.push(candidate);
      visited[candidate] = true;
      backWay[candidate] = startingPosition;
    }
    candidate = startingPosition + size; // lower cell
    if (candidate < model.length && model[candidate] === 0 && !visited[candidate]) {
      positionsToCheck.push(candidate);
      visited[candidate] = true;
      backWay[candidate] = startingPosition;
    }
    candidate = startingPosition - 1; // left cell
    if (startingPosition % size !== 0 && model[candidate] === 0 && !visited[candidate]) {
      positionsToCheck.push(candidate);
      visited[candidate] = true;
      backWay[candidate] = startingPosition;
    }
    candidate = startingPosition + 1; // right cell
    if (startingPosition % size !== size - 1 && model[candidate] === 0 && !visited[candidate]) {
      positionsToCheck.push(candidate);
      visited[candidate] = true;
      backWay[candidate] = startingPosition;
    }
    nextToCheck++;
  }

  return null;
}
