import React, { ReactElement } from 'react'
import style from './partner.module.scss'
import { Image } from 'react-bootstrap'

interface Props {
  image: string
}

export const PartnerCard = (props: Props): ReactElement => {
  const { image } = props

  return (
    <div className={style.wrapper}>
      <Image src={image} className={style.partnerImage}/>
    </div>
  )
}