import React, { ReactElement } from 'react'
import { IconMapName, SVGIcon } from '../../../assets/icon'
import { Palette } from '../../../../../models/enum'
import style from './speech.module.scss'
import { useTranslation } from 'react-i18next'

interface Props {
  icon: keyof typeof IconMapName
  content: string
}

export const SpeechProcessCard = (props: Props): ReactElement => {
  const { icon, content } = props
  const { t } = useTranslation()

  return (
    <div className={style.wrapper}>
      <div className={style.group}>
        <div className={style.container}>
          <SVGIcon icon={icon} color={Palette.BLUE} className={style.icon}/>
          <p className={style.content}>{t(content)}</p>
        </div>
        <div className={style.rectangle} />
      </div>
    </div>
  )
}