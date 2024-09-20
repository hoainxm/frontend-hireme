import React, { FC } from 'react'
import { SectionLayout } from '../../common/ui/layout/section-layout'
import { Palette } from '../../models/enum'
import style from './home.module.scss'
import { NLP_ITEMS } from './constant'
import { NLPCard } from '../../common/ui/base/card'

interface Props {
  sectionId: string
}

export const NLPSection: FC<Props> = (props) => {
  const { sectionId } = props

  return (
    <SectionLayout
      id={sectionId}
      title="product.naturalLanguage"
      subTitle='product.naturalLanguage.subTitle'
      backgroundColor={Palette.BLUE}
    >
      <div className={style.gridFourColumns}>
        {NLP_ITEMS.map(item => (
          <NLPCard
            key={`${item.icon}`}
            icon={item.icon}
            content={item.content}
          />
        ))}
      </div>
    </SectionLayout>
  )
}