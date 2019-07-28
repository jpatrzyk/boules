import React from 'react';

import './BoardCell.css';

interface Props {
    x: number;
    y: number;
    value: number; // 0 - empty, 1,2,... - color
    onClick: (x: number, y: number) => void;
}

const Colors = [
    '',
    'red',
    'blue',
    'green',
    'yellow'
];

export const BoardCell: React.FC<Props> = ({ x, y, value, onClick }: Props) => {
    function cellClicked() {
        onClick(x, y);
    }

    function renderContent() {
        if (!value) {
            return null;
        }
        return <div className="BoardCell-circle" style={{ backgroundImage: `radial-gradient(farthest-corner at 60% 40%, white, ${Colors[value]})` }} />;
    }

    return (
        <button className="BoardCell" onClick={cellClicked}>
            {renderContent()}
        </button>
    );
};
