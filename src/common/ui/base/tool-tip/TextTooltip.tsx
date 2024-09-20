import React, { FC, HTMLAttributes, ReactNode } from 'react'
import { OverlayTrigger } from 'react-bootstrap';
import { OverlayInjectedProps, Placement } from 'react-bootstrap/esm/Overlay';
import style from './tooltip.module.scss';
import { CTooltip } from '.';

interface Props extends HTMLAttributes<HTMLDivElement> {
  visible: boolean
  tooltipContent: string
  placement: Placement
  isContrast?: boolean
  children?: ReactNode
}

export const TextTooltip: FC<Props> = (props) => {
  const { visible, tooltipContent, placement, isContrast = false, id } = props

  const renderTooltip = (props: OverlayInjectedProps) => (
    <div id={`${id}-text-tooltip`} {...props}>
      <CTooltip
        text={tooltipContent}
        visible={visible}
        className={
          `${style[placement]} ` +
          `${isContrast && style.isContrast} `
        }
      />
    </div>
  );


  return (
    <OverlayTrigger
      placement={placement}
      overlay={renderTooltip}
    >
      <div className={`${style.content} ${props.className}`}>
        {props.children}
      </div>
    </OverlayTrigger>
  )
}