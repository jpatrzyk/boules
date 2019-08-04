import React from 'react';
import classNames from 'classnames';

import './ColoredCell.scss';

interface Props {
  value: number; // 0 - empty, 1,2,... - color
  selected?: boolean;
  moveTo?: Direction;
  fillNewValue?: number;
  disappearing?: boolean;
}

export enum Direction {
  up = 'Up',
  down = 'Down',
  left = 'Left',
  right = 'Right',
}

export const ColoredCell: React.FC<Props> = ({
  value,
  selected,
  moveTo,
  fillNewValue,
  disappearing,
}: Props) => {
  function renderContent() {
    if (!value && !fillNewValue) {
      return null;
    }
    const color = value || fillNewValue;

    const className = classNames('ColoredCell-circle', `ColoredCell-circle--${color}`, {
      'ColoredCell-circle--selected': selected,
      'ColoredCell-circle--moving': !!moveTo,
      [`ColoredCell-circle--moving${moveTo}`]: !!moveTo,
      'ColoredCell-circle--appearing': !!fillNewValue,
      'ColoredCell-circle--disappearing': disappearing,
    });

    return <div className={className} />;
  }

  return <div className="ColoredCell">{renderContent()}</div>;
};
