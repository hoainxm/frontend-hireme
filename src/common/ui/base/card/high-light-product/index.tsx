import React, { ReactElement } from 'react'
import style from './highlight.module.scss'
import { IconMapName, SVGIcon } from '../../../assets/icon'
import { Palette } from '../../../../../models/enum'
import { useTranslation } from 'react-i18next'

interface Props {
  icon: keyof typeof IconMapName
  content: string
}

export const HighLightProductCard = (props: Props): ReactElement => {
  const { icon, content } = props
  const { t } = useTranslation()
 
  return (
    <div className={style.container}>
      <div className={style.iconWrapper}>
        <div className={style.iconContainer}>
          <SVGIcon icon={icon} color={Palette.BLUE} className={style.icon}/>
        </div>
      </div>
      <p className={style.content}>{t(content)}</p>
    </div>
  )
}