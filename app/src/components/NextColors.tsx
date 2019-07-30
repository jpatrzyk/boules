import React from 'react';

import { ColoredCell } from './ColoredCell';

import './NextColors.scss';

interface Props {
  nextColors: number[];
}

export const NextColors: React.FC<Props> = ({ nextColors }: Props) => {
  return (
    <div className="NextColors">
      <h2>Next colors:</h2>
      <div className="NextColors-row">
        {nextColors.map((value, index) => {
          return <ColoredCell key={index} value={value} />;
        })}
      </div>
    </div>
  );
};
