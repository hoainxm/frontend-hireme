import React, { FC, HTMLAttributes, ReactNode } from 'react'
import style from './projects.module.scss'
import { NOT_SET } from '../../../../common/utils/constants'
import { useTranslation } from 'react-i18next'
import { Col, Row } from 'react-bootstrap'

interface Props extends HTMLAttributes<HTMLElement> {
  projectSummary?: string
  projectHighlight?: Array<string>
  rightContent?: ReactNode
}

export const LayoutProject: FC<Props> = (props) => {
  const { t } = useTranslation()

  return (
    <Row className={style.projectLayout}>
      <Col className={style.columnLeft}>
        <div className={style.left}>
          <div className={style.summary}>
            <div className={style.summaryTitle}>{t("project.summary")}</div>
            <div className={style.summaryContent}>
              {props.projectSummary ? t(props.projectSummary) : NOT_SET}
            </div>
          </div>
          <div className={style.highlight}>
            <div className={style.highlightTitle}>{t("project.highlight")}</div>
            {props.projectHighlight && props.projectHighlight.length > 0 ?
              <>
                {props.projectHighlight.map((hl, index) => (
                  <div key={index} className={style.highlightItem}>
                    <div className={style.rectangle}></div>
                    <p>{t(hl)}</p>
                  </div>
                ))}
              </> :
              <div className={style.highlightItem}>{NOT_SET}</div>
            }
          </div>
        </div>
      </Col>
      <Col className={style.columnRight}>
        <div className={style.right}>
          {props.rightContent}
        </div>
      </Col>
    </Row>
  )
}