import React from 'react';

import './ColoredCell.css';

interface Props {
  value: number; // 0 - empty, 1,2,... - color
  isSelected?: boolean;
  animateTo?: Direction;
}

export enum Direction {
  top = 'Top',
  bottom = 'Bottom',
  left = 'Left',
  right = 'Right',
}

export const ColoredCell: React.FC<Props> = ({ value, isSelected }: Props) => {
  function renderContent() {
    if (!value) {
      return null;
    }
    const classNames = [`ColoredCell-circle ColoredCell-circle--${value}`];
    if (isSelected) {
      classNames.push('ColoredCell-circle--selected');
    }

    return <div className={classNames.join(' ')} />;
  }

  return <div className="ColoredCell">{renderContent()}</div>;
};
