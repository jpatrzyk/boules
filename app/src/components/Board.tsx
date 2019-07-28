import React from 'react';

import { BoardCell } from "./BoardCell";

interface Props {
    size: number;
    model: number[];
    onClick: (x: number, y: number) => void
}

function range(n: number) {
    const result = Array(n);
    for (let i = 0; i < n; i++) {
        result[i] = i;
    }
    return result;
}

export const Board: React.FC<Props> = ({ size, model, onClick }: Props) => {

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {range(size).map(x => {
                return (
                    <div style={{ display: 'flex' }}>
                        {range(size).map(y => {
                            const value = model[x * size + y];
                            return (
                                <BoardCell x={x} y={y} value={value} onClick={onClick} />
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};
