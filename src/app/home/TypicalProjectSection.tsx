import React, { FC } from 'react'
import { SectionLayout } from '../../common/ui/layout/section-layout'
import { ProjectTabsLayout } from './components/projects/ProjectTabsLayout'
import { Palette } from '../../models/enum'
import { TYPICAL_PROJECT_TABS } from './constant'

interface Props {
  sectionId: string
}

export const TypicalProjectSection: FC<Props> = (props) => {
  const { sectionId } = props

  return (
    <SectionLayout
      id={sectionId}
      title="title.project"
      backgroundColor={Palette.BLUE}
    >
      <ProjectTabsLayout tabs={TYPICAL_PROJECT_TABS}>
        {TYPICAL_PROJECT_TABS.map(prj => {
          const Component = prj.component
          return (
            <Component key={prj.contentId} id={prj.contentId} videoId={prj.videoId} />
          )
        })}
      </ProjectTabsLayout>
    </SectionLayout>
  )
}