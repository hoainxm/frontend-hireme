import React, { FC, HTMLAttributes } from 'react';
import style from './shared.module.scss';

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
  contentClass?: string;
}

export const SectionContainer: FC<Props> = (props) => {
  return (
    <div className={`${style.sectionContainer} ${props.className}`}>
      {props.title && <h5 className={style.title}>{props.title}</h5>}
      <div className={`${style.section} ${props.contentClass}`}>{props.children}</div>
    </div>
  );
};
