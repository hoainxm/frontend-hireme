import React, { HTMLAttributes, FC } from 'react'
import { LayoutProject } from './LayoutProject'
import { Image } from 'react-bootstrap'
import DocumentReaderImage from '@images/DocumentReader.png'
import DocumentReaderCapture from '@images/DocumentReaderCapture.png'
import style from './projects.module.scss'
import { CZoomVideo } from '@base/zoom-video'
import { getYoutubeLink } from '../../../../common/utils/common'

interface Props {
  videoId: string
}

export const DocumentReader: FC<Props> = (props) => {
  const { videoId } = props

  const highlights: Array<string> = [
    "project.docsReader.highlight.first",
    "project.docsReader.highlight.second"
  ]

  return (
    <LayoutProject
      projectSummary='project.docsReader.summary'
      projectHighlight={highlights}
      rightContent={
        <div className={style.docReaderContainer}>
          <Image src={DocumentReaderImage} width="100%"/>
          <div className={style.videoContainer}>
            <CZoomVideo
              imageCapture={DocumentReaderCapture}
              src={getYoutubeLink(videoId)}
            />
          </div>
        </div>
      }
    />
  )
}