import React, { FC, HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { OverlayInjectedProps, Placement } from 'react-bootstrap/esm/Overlay';
import style from './tooltip.module.scss';
import { CTooltip } from '.';

interface Props extends HTMLAttributes<HTMLDivElement> {
  tooltipContent: string
  placement: Placement
  isContrast?: boolean
  children?: ReactNode
}

export const TruncatedTextTooltip: FC<Props> = (props) => {
  const { tooltipContent, placement, isContrast = false, id } = props
  const [isEllipsisActive, setIsEllipsisActive] = useState<boolean>(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const checkEllipsisWidth = textRef.current.scrollWidth > textRef.current.offsetWidth
      const checkEllipsisHeight = textRef.current.scrollHeight > textRef.current.offsetHeight
      setIsEllipsisActive(checkEllipsisWidth || checkEllipsisHeight);
    }
  }, [isEllipsisActive, props.children]);

  const renderTooltip = (props: OverlayInjectedProps) => (
    <div id={`${id}-truncated-text-tooltip`} {...props}>
      <CTooltip
        text={tooltipContent}
        visible={isEllipsisActive}
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
      <div ref={textRef} className={`${style.content} ${props.className}`}>
        {props.children}
      </div>
    </OverlayTrigger>
  );
}