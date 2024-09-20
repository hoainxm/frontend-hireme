import { SectionLayout } from '../../common/ui/layout/section-layout'
import React, { FC, ReactElement } from 'react'
import style from './home.module.scss'
import { SERVICE_ITEMS } from './constant'
import { ServiceCard } from '../../common/ui/base/card'

interface Props {
  sectionId: string
}

export const ServiceSection: FC<Props> = (props) => {
  const { sectionId } = props

  return (
    <SectionLayout
      id={sectionId}
      title="title.service"
    >
      <div className={style.gridThreeColumns}>
        {SERVICE_ITEMS.map((item, index) => (
          <ServiceCard
            key={`${item.content}_${index}`}
            icon={item.icon}
            content={item.content}
          />
        ))}
      </div>
    </SectionLayout>
  )
}