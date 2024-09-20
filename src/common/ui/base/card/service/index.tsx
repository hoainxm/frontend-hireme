import React, { ReactElement } from 'react'
import style from './service.module.scss'
import { IconMapName, SVGIcon } from '../../../assets/icon'
import { Palette } from '../../../../../models/enum'
import { useTranslation } from 'react-i18next'

interface Props {
  icon: keyof typeof IconMapName,
  content: string
}

export const ServiceCard = (props: Props): ReactElement => {
  const { icon, content } = props
  const { t } = useTranslation()

  const hasSlash = t(content).includes("/")

  return (
    <div className={style.wrapper}>
      <div className={style.ellipse}>
        <SVGIcon icon={icon} color={Palette.WHITE} size={48}/>
      </div>
      <p className={hasSlash && style.hasSlash}>{t(content)}</p>
    </div>
  )
}