import React, { FC, HTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import style from './tooltip.module.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {
  text: string
  visible: boolean
}

export const CTooltip: FC<Props> = (props) => {
  const { text, visible } = props
  const { t } = useTranslation()

  return (
    <div {...props} className={`${style.tooltip} ${visible && style.visible} ${props.className}`}>
      {t(text)}
    </div>
  )
}