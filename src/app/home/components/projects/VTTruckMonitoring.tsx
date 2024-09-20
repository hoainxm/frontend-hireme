import VTTruckCapture from '@images/VTTruckCapture.png'
import VTTruck from '@images/VTTruck.png'
import React, { FC, ReactElement } from 'react'
import { Image } from 'react-bootstrap'
import style from './projects.module.scss'
import { LayoutProject } from './LayoutProject'
import { CZoomVideo } from '@base/zoom-video'
import { getYoutubeLink } from '../../../../common/utils/common'

interface Props {
  videoId: string
}

export const VTTruckMonitoring: FC<Props> = (props) => {
  const { videoId } = props

  const highlights: Array<string> = [
    "project.vtTruckMonitoring.highlight.first",
    "project.vtTruckMonitoring.highlight.second",
    "project.vtTruckMonitoring.highlight.third",
    "project.vtTruckMonitoring.highlight.fourth",
    "project.vtTruckMonitoring.highlight.fifth",
  ]

  const RightContent = (): ReactElement => {
    return (
      <div className={style.imageContainer}>
        <div className={style.firstImage}>
          <CZoomVideo
            imageCapture={VTTruckCapture}
            src={getYoutubeLink(videoId)}
          />
        </div>
        <div className={style.secondImage}>
          <Image src={VTTruck}/>
        </div>
      </div>
    )
  }

  return (
    <LayoutProject
      projectSummary='project.vtTruckMonitoring.summary'
      projectHighlight={highlights}
      rightContent={RightContent()}
    />
  )
}