import { CZoomVideo } from '@base/zoom-video'
import OCRMCare01 from '@images/OCRMCare01.png'
import OCRMCare02 from '@images/OCRMCare02.png'
import OCRMCare03 from '@images/OCRMCare03.png'
import OCRMCare04 from '@images/OCRMCare04.png'
import OCRMCareCapture from '@images/OCRMCareCapture.png'
import React, { FC } from 'react'
import { Image } from 'react-bootstrap'
import { getYoutubeLink } from '../../../../common/utils/common'
import { LayoutProject } from './LayoutProject'
import style from './projects.module.scss'

interface Props {
  videoId: string
}

export const OCRMCare: FC<Props> = (props) => {
  const { videoId } = props
  
  const highlights: Array<string> = [
    "project.ocrMCare.highlight.first",
    "project.ocrMCare.highlight.second",
    "project.ocrMCare.highlight.third",
    "project.ocrMCare.highlight.fourth",
    "project.ocrMCare.highlight.fifth",
    "project.ocrMCare.highlight.six",
  ]

  const RightContent = () => {
    return (
      <div className={style.ocrMCareContainer}>
        <div className={style.firstImage}>
          <div className={style.ocrVideo}>
            <CZoomVideo
              imageCapture={OCRMCareCapture}
              src={getYoutubeLink(videoId)}
            />
          </div>
          <Image src={OCRMCare01}/>
          <Image src={OCRMCare02}/>
        </div>
        <div className={style.secondImage}>
          <Image src={OCRMCare03} />
          <Image src={OCRMCare04}/>
        </div>
      </div>
    )
  }

  return (
    <LayoutProject
      projectSummary='project.ocrMCare.summary'
      projectHighlight={highlights}
      rightContent={RightContent()}
    />
  )
}