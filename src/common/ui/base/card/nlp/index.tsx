import React, { ReactElement } from 'react'
import style from './nlp.module.scss'
import { IconMapName, SVGIcon } from '../../../assets/icon'
import { Palette } from '../../../../../models/enum'
import { useTranslation } from 'react-i18next'

interface Props {
  icon: keyof typeof IconMapName
  content: string
}

export const NLPCard = (props: Props): ReactElement => {
  const { icon, content } = props
  const { t } = useTranslation()

  return (
    <div className={style.wrapper}>
      <SVGIcon 
        icon={icon} 
        size={56} 
        color={ icon === "InfoExtraction" ? Palette.ORIGIN : Palette.BLUE}
      />
      <p className={style.content}>{t(content)}</p>
    </div>
  )
}