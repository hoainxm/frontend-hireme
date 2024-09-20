import { CZoomVideo } from '@base/zoom-video'
import IPHCapture from '@images/IPHCapture.png'
import IPHProject from '@images/IPHProject.png'
import React, { FC } from 'react'
import { Image } from 'react-bootstrap'
import { LayoutProject } from './LayoutProject'
import style from './projects.module.scss'
import { getYoutubeLink } from '../../../../common/utils/common'

interface Props {
  videoId: string
}

export const IPH: FC<Props> = (props) => {
  const { videoId } = props

  const highlights: Array<string> = [
    "project.iph.highlight.first",
    "project.iph.highlight.second"
  ]

  const RightContent = () => {
    return (
      <div className={style.imageContainer}>
        <div className={style.firstImage}>
          <CZoomVideo
            imageCapture={IPHCapture}
            src={getYoutubeLink(videoId)}
          />
        </div>
        <div className={style.secondImage}>
          <Image src={IPHProject} width="100%"/>
        </div>
      </div>
    )
  }

  return (
    <LayoutProject
      projectSummary='project.iph.summary'
      projectHighlight={highlights}
      rightContent={RightContent()}
    />
  )
}