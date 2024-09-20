import { IconMapName, SVGIcon } from '../../../assets/icon'
import React, { FC } from 'react'
import style from './highlightocr.module.scss'
import { useTranslation } from 'react-i18next'
import { Palette } from '../../../../../models/enum'

interface Props {
  icon: keyof typeof IconMapName,
  title: string,
  contents: Array<string>
}

export const HighLightOCRCard: FC<Props> = (props) => {
  const { icon, title, contents } = props
  const { t } = useTranslation()

  return (
    <div className={style.wrapper}>
      <div className={style.heading}>
        <SVGIcon icon={icon} color={Palette.WHITE} size={48} />
        <div className={style.line}/>
        <h4 className={style.title}>{t(title)}</h4>
      </div>
      <div className={style.content}>
        {contents.map((content, index) => (
          <div key={index} className={style.item}>
            <div className={style.rectangle}></div>
            <h6>{t(content)}</h6>
          </div>
        ))}
      </div>
    </div>
  )
}