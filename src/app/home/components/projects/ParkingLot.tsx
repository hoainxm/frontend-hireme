import ParkingLotCapture from '@images/ParkingLotCapture.png'
import ParkingLotImage from '@images/ParkingLot.png'
import React, { FC, ReactElement } from 'react'
import { Image } from 'react-bootstrap'
import style from './projects.module.scss'
import { LayoutProject } from './LayoutProject'
import { CZoomVideo } from '@base/zoom-video'
import { getYoutubeLink } from '../../../../common/utils/common'

interface Props {
  videoId: string
}

export const ParkingLot: FC<Props> = (props) => {
  const { videoId } = props

  const highlights: Array<string> = [
    "project.parkingLot.highlight.first",
    "project.parkingLot.highlight.second",
    "project.parkingLot.highlight.third",
    "project.parkingLot.highlight.fourth"
  ]

  const RightContent = (): ReactElement => {
    return (
      <div className={style.imageContainer}>
        <div className={style.firstImage}>
          <CZoomVideo
            imageCapture={ParkingLotCapture}
            src={getYoutubeLink(videoId)}
          />
        </div>
        <div className={style.secondImage}>
          <Image src={ParkingLotImage}/>
        </div>
      </div>
    )
  }

  return (
    <LayoutProject
      projectSummary='project.parkingLot.summary'
      projectHighlight={highlights}
      rightContent={RightContent()}
    />
  )
}