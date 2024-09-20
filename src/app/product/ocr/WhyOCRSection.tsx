import { SectionLayout } from '../../../common/ui/layout/section-layout'
import React, { FC } from 'react'
import { WHY_OCR_ITEMS } from './constant'
import { HighLightOCRCard } from '@base/card/high-light-ocr'
import style from './productOcr.module.scss'

interface Props {
  sectionId: string
}

export const WhyOCRSection: FC<Props> = (props) => {
  const { sectionId } = props
  
  return (
    <SectionLayout id={sectionId} title="product.ocr.whyOCR">
      <div className={style.whyOCR}>
        {WHY_OCR_ITEMS.map((item, index) => (
          <HighLightOCRCard 
            key={index}
            icon={item.icon}
            title={item.title}
            contents={item.contents}
          />
        ))}
      </div>
    </SectionLayout>
  )
}