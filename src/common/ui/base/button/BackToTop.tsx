import React, { FC } from 'react'
import { SVGIcon } from '../../../../common/ui/assets/icon'
import { Palette } from '../../../../models/enum'
import style from './btn.module.scss'

interface Props {
  resetScrollNavigation?: () => void
}

export const BackToTop: FC<Props> = (props) => {
  const scrollToTop = () => {
    props.resetScrollNavigation && props.resetScrollNavigation
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <SVGIcon
      icon='BackToTop'
      color={Palette.BLUE}
      size={40}
      className={style.backToTop}
      onClick={scrollToTop}
    />
  )
}