/** @format */

import React, { FC, HTMLAttributes } from 'react';
import style from './paging.module.scss';
import { SVGIcon } from '../../../assets/icon';
import { Palette } from '@models/enum';

interface Props extends HTMLAttributes<HTMLElement> {
  active: boolean;
  prev?: boolean;
  next?: boolean;
}

const PagingItem: FC<Props> = (props: Props) => {
  const { prev = false, next = false, active = false } = props;

  return (
    <div
      className={
        `${style.item} ` +
        `${!prev && !next && style.number} ` +
        `${!prev && !next && active && style.active} ` +
        `${(prev || next) && style.prevNext}`
      }
      onClick={(prev || next) && !active ? undefined : props.onClick}
    >
      {prev && (
        <SVGIcon
          size={16}
          icon='ArrowLeft'
          className={`${style.arrow} ${!active && style.disabled}`}
          color={active ? Palette.BLUE : Palette.FIRST_GRAY}
        />
      )}
      {!prev && !next && props.children}
      {next && (
        <SVGIcon
          size={16}
          icon='ArrowRight'
          className={`${style.arrow} ${!active && style.disabled}`}
          color={active ? Palette.BLUE : Palette.FIRST_GRAY}
        />
      )}
    </div>
  );
};

export default PagingItem;
