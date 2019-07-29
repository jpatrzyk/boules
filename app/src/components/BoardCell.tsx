import React, { useEffect } from 'react';

import { ColoredCell, Direction } from './ColoredCell';
import './BoardCell.css';

interface Props {
  position: number;
  value: number; // 0 - empty, 1,2,... - color
  isSelected: boolean;
  animateTo?: Direction;
  onClick: (position: number) => void;
  onMoveFinished: (position: number) => void;
}

export const BoardCell: React.FC<Props> = ({ position, value, isSelected, animateTo, onClick, onMoveFinished }: Props) => {
  useEffect(() => {
    if (animateTo) {
      const timeout = setTimeout(() => {
        onMoveFinished(position);
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
    <button className="BoardCell" onClick={cellClicked}>
      <ColoredCell value={value} isSelected={isSelected} animateTo={animateTo} />
    </button>
  );
};
