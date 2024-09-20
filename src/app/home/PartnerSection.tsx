import { Palette } from '../../models/enum'
import { PartnerCard } from '../../common/ui/base/card'
import { SectionLayout } from '../../common/ui/layout/section-layout'
import { PARTNER_IMAGES } from './constant'
import style from './home.module.scss'
import React, { FC, ReactElement } from 'react'

interface Props {
  sectionId: string
}

export const PartnerSection: FC<Props> = (props) => {
  const { sectionId } = props

  return (
    <SectionLayout
      id={sectionId}
      title="title.ourPartner"
      backgroundColor={Palette.BLUE}
    >
      <div className={style.partners}>
        {PARTNER_IMAGES.map((item, index) => (
          <PartnerCard
            key={`${item}_${index}`}
            image={item}
          />
        ))}
      </div>
    </SectionLayout>
  )
}