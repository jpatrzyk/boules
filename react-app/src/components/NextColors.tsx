import React from 'react';
import { useTranslation } from 'react-i18next';

import { ColoredCell } from './ColoredCell';

import './NextColors.scss';

interface Props {
  nextColors: number[];
}

export const NextColors: React.FC<Props> = ({ nextColors }: Props) => {
  const { t } = useTranslation();
  return (
    <div className="NextColors">
      <h2>{t('app.next_colors')}</h2>
      <div className="NextColors-row">
        {nextColors.map((value, index) => {
          return (
            <div key={index} className="NextColors-cell">
              <ColoredCell value={value} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
