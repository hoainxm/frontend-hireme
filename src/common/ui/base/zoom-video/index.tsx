import React, { FC, VideoHTMLAttributes, useState } from 'react'
import { Image, Modal } from 'react-bootstrap'
import style from './zoomVideo.module.scss'

interface Props extends VideoHTMLAttributes<HTMLVideoElement> {
  imageCapture: string;
  src: string
}

export const CZoomVideo: FC<Props> = (props) => {
  const { imageCapture, src } = props
  const [isOpen, setOpen] = useState<boolean>(false);
  const toggle = () => setOpen(prev => !prev);

  return (
    <>
      <div className={style.imageCapture} onClick={toggle}>
        <Image src={imageCapture} width="100%" height="100%" />
      </div>
      <Modal size="lg" centered show={isOpen} onHide={toggle} className={style.modalContainer}>
        <Modal.Body className={style.modalBody}>
          <iframe className={style.video} src={src} allowFullScreen/>
        </Modal.Body>
      </Modal>
    </>
  )
}