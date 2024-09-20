import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import style from './dataAnalytics.module.scss'

interface Props {
  content: string
}

export const DataAnalyticCard = (props: Props): ReactElement => {
  const { content } = props
  const { t } = useTranslation()

  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        {t(content)}
      </div>
    </div>
  )
}