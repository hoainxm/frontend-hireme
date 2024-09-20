import { BackToTop } from '@base/button/BackToTop'
import { ScrollSectionNavigation } from '@base/navigation/ScrollSectionNavigation'
import { useDispatch } from 'react-redux'
import { updateSectionDot } from '@layout/slice'
import React, { FC } from 'react'
import MainLayout from '../../../common/ui/layout/main-layout'
import { PageName, SectionID } from '../../../models/enum'
import { OCR_PAGE_SECTIONS } from './constant'

export const ProductOCR: FC = () => {
  const allSections = OCR_PAGE_SECTIONS.map(s => ({ sectionId: s.sectionId, text: s.text }))
  const dispatch = useDispatch();

  const scrollToTop = () => {
    dispatch(updateSectionDot(SectionID.OCR_BANNER))
  }

  return (
    <MainLayout active={PageName.OCR}>
      <ScrollSectionNavigation
        sections={allSections}
        defaultSection={SectionID.OCR_BANNER}
      />
      {OCR_PAGE_SECTIONS.map(item => {
        const Component = item.section
        return <Component key={item.sectionId} sectionId={item.sectionId} />
      })}
      <BackToTop resetScrollNavigation={scrollToTop}/>
    </MainLayout>
  )
}