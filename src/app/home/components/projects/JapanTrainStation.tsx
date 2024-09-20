import Japan from '@images/Japan.png'
import JapanCapture from '@images/JapanCapture.png'
import React, { FC } from 'react'
import { Image } from 'react-bootstrap'
import { LayoutProject } from './LayoutProject'
import style from './projects.module.scss'
import { CZoomVideo } from '@base/zoom-video'
import { getYoutubeLink } from '../../../../common/utils/common'

interface Props {
  videoId: string
}

export const JapanTrainStation: FC<Props> = (props) => {
  const { videoId } = props

  const highlights: Array<string> = [
    "project.jpTrainStation.highlight.first",
    "project.jpTrainStation.highlight.second"
  ]

  const RightContent = () => {
    return (
      <div className={style.imageContainer}>
        <div className={style.firstImage}>
          <CZoomVideo
            imageCapture={JapanCapture}
            src={getYoutubeLink(videoId)}
          />
        </div>
        <div className={style.secondImage}>
          <Image src={Japan}/>
        </div>
      </div>
    )
  }

  return (
    <LayoutProject
      projectSummary='project.jpTrainStation.summary'
      projectHighlight={highlights}
      rightContent={RightContent()}
    />
  )
}