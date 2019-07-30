import React from 'react';

import './ColoredCell.scss';

interface Props {
  value: number; // 0 - empty, 1,2,... - color
  selected?: boolean;
  animateTo?: Direction;
}

export enum Direction {
  up = 'Up',
  down = 'Down',
  left = 'Left',
  right = 'Right',
}

export const ColoredCell: React.FC<Props> = ({ value, selected, animateTo }: Props) => {
  function renderContent() {
    if (!value) {
      return null;
    }
    const classNames = [`ColoredCell-circle ColoredCell-circle--${value}`];
    if (animateTo) {
      classNames.push('ColoredCell-circle--moving', `ColoredCell-circle--moving${animateTo}`);
    } else if (selected) {
      classNames.push('ColoredCell-circle--selected');
    }

    return <div className={classNames.join(' ')} />;
  }

  return <div className="ColoredCell">{renderContent()}</div>;
};
