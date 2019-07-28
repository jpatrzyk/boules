import React from 'react';

import './ColoredCell.css';

interface Props {
  value: number; // 0 - empty, 1,2,... - color
}

export const ColoredCell: React.FC<Props> = ({ value }: Props) => {
  function renderContent() {
    if (!value) {
      return null;
    }
    return <div className={`ColoredCell-circle ColoredCell-circle--${value}`}/>;
  }

  return (
    <div className="ColoredCell">
      {renderContent()}
    </div>
  );
};
