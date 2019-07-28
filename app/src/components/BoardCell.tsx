import React from 'react';

interface Props {
    x: number;
    y: number;
    value: number; // 0 - empty, 1,2,... - color
    onClick: (x: number, y: number) => void;
}

export const BoardCell: React.FC<Props> = ({ x, y, value, onClick }: Props) => {
    function cellClicked() {
        onClick(x, y);
    }

    return (
        <button onClick={cellClicked}>
            {value}
        </button>
    );
};
