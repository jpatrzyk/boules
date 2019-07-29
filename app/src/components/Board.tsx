import React from 'react';

import { range } from "utils/helpers";
import { BoardCell } from "./BoardCell";

import './Board.css';

interface Props {
  size: number;
  model: number[];
  selectedBall?: number;
  onClick: (x: number, y: number) => void
}

export const Board: React.FC<Props> = ({size, model, selectedBall, onClick}: Props) => {

  return (
    <div className="Board">
      {range(size).map(x => {
        return (
          <div key={x} className="Board-row">
            {range(size).map(y => {
              const position = x * size + y;
              const value = model[position];
              const isSelected = selectedBall === position;
              return (
                <BoardCell
                  key={y}
                  x={x}
                  y={y}
                  value={value}
                  isSelected={isSelected}
                  onClick={onClick}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
