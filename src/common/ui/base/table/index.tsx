/** @format */

import React, { FC, TableHTMLAttributes, UIEvent, useRef } from 'react';
import style from './table.module.scss';

interface Props extends TableHTMLAttributes<HTMLTableElement> {
  responsive?: boolean;
  maxHeight?: number | string;
  onScrollContent?: (boundElem: HTMLDivElement | null, contentElem: HTMLTableElement | null) => void;
}

const CTable: FC<Props> = (props: Props) => {
  const { responsive = false, id } = props;
  const customStyle = props.maxHeight ? { maxHeight: props.maxHeight } : {};

  const boundRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLTableElement | null>(null);

  const onScroll = (e: UIEvent<HTMLElement>): void => {
    if (props.onScrollContent) props.onScrollContent(boundRef.current, contentRef.current);
  };

  return (
    <div
      id={id}
      ref={boundRef}
      onScroll={onScroll}
      className={`${style.ctable} ${responsive && style.responsive}`}
      style={Object.assign({}, props.style, customStyle)}
    >
      <table className={props.className} ref={contentRef}>
        {props.children}
      </table>
    </div>
  );
};

export default CTable;
