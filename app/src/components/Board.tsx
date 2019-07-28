import React from 'react';

import { range } from "../utils/helpers";
import { BoardCell } from "./BoardCell";

import './Board.css';

interface Props {
  size: number;
  model: number[];
  onClick: (x: number, y: number) => void
}

export const Board: React.FC<Props> = ({size, model, onClick}: Props) => {

  return (
    <div className="Board">
      {range(size).map(x => {
        return (
          <div key={x} className="Board-row">
            {range(size).map(y => {
              const value = model[x * size + y];
              return (
                <BoardCell
                  key={y}
                  x={x}
                  y={y}
                  value={value}
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
