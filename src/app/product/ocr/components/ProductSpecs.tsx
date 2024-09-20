import React, { FC, ReactNode } from 'react'
import style from '../productOcr.module.scss'
import { Image } from 'react-bootstrap'
import Effective from '@images/Effective.svg'

interface Props {
  title: string
  icon: string
  isReverse?: boolean
  isBorderContent?: boolean
  content?: ReactNode
  contentClassName?: string
}

export const ProductSpecs: FC<Props> = (props) => {
  const { isReverse = false, isBorderContent = false, title, icon, content, contentClassName } = props

  return (
    <div className={style.specContainer}>
      <div className={style.specTitle}>
        {title}
        <div className={`${style.iconContainer} ${isReverse && style.iconContainerReverse}`}>
          <Image src={icon || Effective} />
        </div>
        <div className={style.circle}/>
        <div className={style.circle}/>
        <div className={style.circle}/>
      </div>
      {content && (
        <div className={
          `${style.specContent} ` +
          `${contentClassName} ` +
          `${isReverse && style.isReverse} ` +
          `${isBorderContent && style.isBorderContent}`
        }>
          {content}
        </div>
      )}
    </div>
  )
}