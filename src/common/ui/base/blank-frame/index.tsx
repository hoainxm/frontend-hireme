/** @format */

import React, { FC } from 'react';
import style from './blankFrame.module.scss';
import NotData from '../../assets/ic/100px/no-data.svg';

interface Props {
  image?: string;
  title: string;
  className?: string;
}

const BlankFrame: FC<Props> = (props: Props) => {
  const { image = NotData, title, className } = props;

  return (
    <div className={`${style.frameContainer} ${className}`}>
      <img src={image} alt='' />
      <p className='mt-3'>{title}</p>
    </div>
  );
};

export default BlankFrame;
