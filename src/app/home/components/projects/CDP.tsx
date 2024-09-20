import { CSwiper } from '@base/swiper'
import { CZoomVideo } from '@base/zoom-video'
import CDPDiagram from '@images/CDPDiagram.png'
import CDPDiagramCapture from '@images/CDPDiagramCapture.png'
import React, { FC } from 'react'
import { Image } from 'react-bootstrap'
import { getYoutubeLink } from '../../../../common/utils/common'
import { LayoutProject } from './LayoutProject'
import style from './projects.module.scss'

interface Props {
  videoId: string
}


export const CDP: FC<Props> = (props) => {
  const { videoId } = props

   const highlights: Array<string> = [
    "project.cdp.highlight.first",
    "project.cdp.highlight.second",
    "project.cdp.highlight.third",
    "project.cdp.highlight.fourth"
  ]

  const RightContent = () => {
    return (
      <CSwiper
        isAutoPlay
        isLoop
        listSlide={[
          <Image src={CDPDiagram} width="100%" />, 
          <div className={style.cdpVideo}>
            <CZoomVideo
              imageCapture={CDPDiagramCapture}
              src={getYoutubeLink(videoId)}
            />
          </div>
        ]}
      />
    )
  }

  return (
    <LayoutProject
      projectSummary='project.cdp.summary'
      projectHighlight={highlights}
      rightContent={RightContent()}
    />
  )
}