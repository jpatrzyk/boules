import React, { useEffect } from 'react';

import { ColoredCell, Direction } from './ColoredCell';
import './BoardCell.scss';

interface Props {
  position: number;
  value: number; // 0 - empty, 1,2,... - color
  selected: boolean;
  disabled?: boolean;
  animateTo?: Direction;
  onClick: (position: number) => void;
  onMoveFinished: () => void;
}

export const BoardCell: React.FC<Props> = ({ position, value, selected, disabled, animateTo, onClick, onMoveFinished }: Props) => {
  useEffect(() => {
    if (animateTo) {
      const timeout = setTimeout(() => {
        onMoveFinished();
      }, 300);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [position, animateTo, onMoveFinished]);

  function cellClicked() {
    onClick(position);
  }

  return (
    <button className="BoardCell" onClick={cellClicked} disabled={disabled}>
      <ColoredCell value={value} selected={selected} animateTo={animateTo} />
    </button>
  );
};
