import TLockerCapture from '@images/TLockerCapture.png'
import TLockerTablet from '@images/TLockerTablet.png'
import TLockerImage from '@images/TLocker.png'
import React, { FC, ReactElement } from 'react'
import { Image } from 'react-bootstrap'
import style from './projects.module.scss'
import { LayoutProject } from './LayoutProject'
import { CZoomVideo } from '@base/zoom-video'
import { getYoutubeLink } from '../../../../common/utils/common'

interface Props {
  videoId: string
}

export const TLocker: FC<Props> = (props) => {
  const { videoId } = props

  const highlights: Array<string> = [
    "project.tLocker.highlight.first",
    "project.tLocker.highlight.second"
  ]

  const RightContent = (): ReactElement => {
    return (
      <div className={style.tlockerContainer}>
        <div className={style.firstImage}>
          <CZoomVideo
            imageCapture={TLockerCapture}
            src={getYoutubeLink(videoId)}
          />
          <Image src={TLockerTablet}/>
        </div>
        <div className={style.secondImage}>
          <Image src={TLockerImage}/>
        </div>
      </div>
    )
  }

  return (
    <LayoutProject
      projectSummary='project.tLocker.summary'
      projectHighlight={highlights}
      rightContent={RightContent()}
    />
  )
}