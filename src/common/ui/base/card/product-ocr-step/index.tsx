import React, { FC } from 'react'
import style from './productOCRStep.module.scss'
import { Image } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

interface Props {
  isReverse?: boolean
  srcImage: string
  title: string
  contents: Array<string>
}

export const ProductOCRCard: FC<Props> = (props) => {
  const { isReverse = false, srcImage, title, contents } = props
  const { t } = useTranslation()

  return (
    <div className={`${style.card} ${isReverse && style.isReverse}`}>
      <div className={style.media}>
        <Image src={srcImage} width={48} height={48} />
        <p>{t(title)}</p>
      </div>
      <div className={style.content}>
        {contents.map((content, index) => (
          <div key={index} className={style.item}>
            <div className={style.rectangle}></div>
            <p>{t(content)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}