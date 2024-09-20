import React, { FC } from 'react'
import { HighLightProductCard } from '../../common/ui/base/card'
import { SectionLayout } from '../../common/ui/layout/section-layout'
import { WHY_TMA_ITEMS } from './constant'
import style from './home.module.scss'

interface Props {
  sectionId: string
}

export const WhyTMASection: FC<Props> = (props) => {
  const { sectionId } = props

  return (
    <SectionLayout id={sectionId} title="title.whyTMA">
      <div className={style.gridThreeColumns}>
        {WHY_TMA_ITEMS.map(item => (
          <HighLightProductCard
            key={`${item.icon}`}
            icon={item.icon}
            content={item.content}
          />
        ))}
      </div>
    </SectionLayout>
  )
}