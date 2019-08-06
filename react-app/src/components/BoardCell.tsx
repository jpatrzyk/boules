import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ColoredCell, Direction } from './ColoredCell';
import './BoardCell.scss';

interface Props {
  x: number;
  y: number;
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
  x,
  y,
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
  const { t } = useTranslation();

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

  const coords = `(${x}, ${y})`;
  const coordsLabel = t('board.cell_label', { coords });
  const contentLabel = value ? t('board.cell_color', { value }) : t('board.cell_empty');

  return (
    <button
      type="button"
      className="BoardCell"
      onClick={cellClicked}
      disabled={disabled}
      aria-label={`${coordsLabel}${contentLabel}`}
    >
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
