import React, { FC, ReactElement } from 'react'
import { SectionLayout } from '../../common/ui/layout/section-layout'
import style from './home.module.scss'
import { SPEECH_ITEMS } from './constant'
import { SpeechProcessCard } from '../../common/ui/base/card'

interface Props {
  sectionId: string
}

export const SpeechSection: FC<Props> = (props) => {
  const { sectionId } = props

  return (
    <SectionLayout
      id={sectionId}
      title="product.speechProcessing"
      subTitle="product.speechProcessing.subTitle"
    >
      <div className={style.gridThreeColumns}>
        {SPEECH_ITEMS.map(item => (
          <SpeechProcessCard
            key={item.icon}
            icon={item.icon}
            content={item.content}
          />
        ))}
      </div>
    </SectionLayout>
  )
}