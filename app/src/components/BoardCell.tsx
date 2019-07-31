import React, { useEffect } from 'react';

import { ColoredCell, Direction } from './ColoredCell';
import './BoardCell.scss';

interface Props {
  position: number;
  value: number; // 0 - empty, 1,2,... - color
  selected: boolean;
  disabled?: boolean;
  moveTo?: Direction;
  fillNewValue?: number;
  disappearing?: boolean;
  onClick: (position: number) => void;
  onAnimationFinished: () => void;
}

export const BoardCell: React.FC<Props> = ({
  position,
  value,
  selected,
  disabled,
  moveTo,
  fillNewValue,
  disappearing,
  onClick,
  onAnimationFinished,
}) => {
  useEffect(() => {
    if (moveTo || fillNewValue || disappearing) {
      const timeout = setTimeout(() => {
        onAnimationFinished();
      }, 150);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [moveTo, fillNewValue, disappearing, onAnimationFinished]);

  function cellClicked() {
    onClick(position);
  }

  return (
    <button type="button" className="BoardCell" onClick={cellClicked} disabled={disabled}>
      <ColoredCell
        value={value}
        selected={selected}
        moveTo={moveTo}
        fillNewValue={fillNewValue}
        disappearing={disappearing}
      />
    </button>
  );
};
