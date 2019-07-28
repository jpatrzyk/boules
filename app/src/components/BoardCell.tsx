import React from 'react';

import { ColoredCell } from "./ColoredCell";
import './BoardCell.css';

interface Props {
  x: number;
  y: number;
  value: number; // 0 - empty, 1,2,... - color
  isSelected: boolean;
  onClick: (x: number, y: number) => void;
}

export const BoardCell: React.FC<Props> = ({ x, y, value, isSelected, onClick }: Props) => {
  function cellClicked() {
    onClick(x, y);
  }

  return (
    <button className="BoardCell" onClick={cellClicked}>
      <ColoredCell value={value} isSelected={isSelected} />
    </button>
  );
};
