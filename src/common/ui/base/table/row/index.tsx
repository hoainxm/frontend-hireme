/** @format */

import React, { CSSProperties, FC, HTMLAttributes, ReactNode } from 'react';
import { HIDDEN_COL } from '../../../../utils/constants';
import style from './row.module.scss';

interface Props extends HTMLAttributes<HTMLElement> {
  header?: boolean;
  data: Array<ReactNode>;
  cellClass?: string;
  positionApplyCellClass?: number;
  rangeApplyCellClass?: [start: number, end: number];
  text?: string;
  isColBorder?: boolean;
  backgroundColors?: Array<string>;
  positionStartApplyBgColor?: number;
  cellStyle?: CSSProperties;
  handleMouseDown?: () => void;
}

const CTRow: FC<Props> = (props: Props) => {
  const { header, data, className, cellClass, positionApplyCellClass, rangeApplyCellClass, cellStyle, backgroundColors, positionStartApplyBgColor } =
    props;

  const getBackgroundColor = (position: number) => {
    if (!backgroundColors?.length) return;
    if (!positionStartApplyBgColor) return { background: backgroundColors[position] };
    if (positionStartApplyBgColor <= position)
      return {
        background: backgroundColors[position - positionStartApplyBgColor],
      };
  };

  const appendMoreClass = (position: number, colum?: ReactNode): string => {
    const className = [];
    const [start, end] = rangeApplyCellClass || [100, 100];
    if (!rangeApplyCellClass && !positionApplyCellClass) className.push(cellClass || '');
    else if (position === positionApplyCellClass || (start <= position && position < end)) className.push(cellClass || '');
    if (props.isColBorder) className.push(style.borderCol);
    if (colum === HIDDEN_COL) className.push('d-none');

    return className.join(' ');
  };

  const columns = header
    ? data.map((column, index) => (
        <th className={appendMoreClass(index)} key={`header-${index}`} style={{ ...cellStyle }}>
          {column}
        </th>
      ))
    : data.map((column, index) => (
        <td style={{ ...cellStyle, ...getBackgroundColor(index) }} className={appendMoreClass(index, column)} key={index}>
          {column}
        </td>
      ));

  return (
    <tr onClick={props.onClick} className={`${className} ${style.row} ${props.onClick && style.rowItem} ${style.box}`}>
      {columns}
    </tr>
  );
};

export default CTRow;
