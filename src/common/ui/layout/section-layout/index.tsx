import React, { CSSProperties, HTMLAttributes, ReactElement } from 'react'
import style from './section.module.scss'
import { Palette } from '../../../../models/enum'
import { Container } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

interface Props extends HTMLAttributes<HTMLDivElement> {
  title?: string
  subTitle?: string
  backgroundImage?: string
  backgroundColor?: Extract<Palette, Palette.BLUE | Palette.WHITE>
}

export const SectionLayout = (props: Props): ReactElement => {
  const { id, title, subTitle, backgroundImage, backgroundColor = Palette.WHITE } = props
  const { t } = useTranslation()

  const wrapperStyles: Partial<CSSProperties> = { 
    background: `url(${backgroundImage}) no-repeat center center/cover`
  }

  return (
    <section 
      id={id}
      className={`${style.wrapper} ${style[backgroundColor]} ${backgroundImage && style.isContrast}`}
      style={backgroundImage ? wrapperStyles : undefined}
    >
      <Container className={style.container}>
        {title && (
          <div className={style.titleContainer}>
            <h1>{t(title)}</h1>
            {subTitle && <h4 className='mt-3'>{t(subTitle)}</h4>}
          </div>
        )}
        {props.children}
      </Container>
    </section>
  )
}