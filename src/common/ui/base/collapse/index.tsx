import React, { FC, HTMLAttributes, useState } from 'react';
import style from './collapse.module.scss';
import Down from '@icon/ArrowDown.svg';
import Up from '@icon/ArrowUp.svg';

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  header: string;
  contentPanelClass?: string;
  children: React.ReactNode;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  isAccordion?: boolean;
  panelProps?: HTMLAttributes<HTMLDivElement>;
  defaultActiveKey?: Array<number>;
}

export const CCollapse: FC<Props> = (props: Props) => {
  const { children, isAccordion = false } = props;
  const [activePanels, setActivePanels] = useState<Array<number>>(props.defaultActiveKey || []);

  const togglePanel = (panelIndex: number) => {
    setActivePanels((prevActivePanels) => {
      if (isAccordion) {
        return prevActivePanels.includes(panelIndex) ? [] : [panelIndex];
      } else {
        return prevActivePanels.includes(panelIndex) ? prevActivePanels.filter((index) => index !== panelIndex) : [...prevActivePanels, panelIndex];
      }
    });
  };

  return (
    <div className={style.collapse}>
      {React.Children.map(children, (child, index) => {
        const panel = child as React.ReactElement<PanelProps>;
        const panelIndex = index;
        const isOpen = activePanels.includes(panelIndex);

        return (
          <div key={index} {...props.panelProps} {...panel.props}>
            <div className={style.header} onClick={() => togglePanel(panelIndex)}>
              <img className={style.img} src={isOpen ? Up : Down} alt='' />
              <span className={style.headerText}>{panel.props.header}</span>
            </div>
            <div className={`${!isOpen && "d-none"} ${style.content} ${panel.props.contentPanelClass}`}>{panel.props.children}</div>
          </div>
        );
      })}
    </div>
  );
};

export const CPanel: FC<PanelProps> = ({ children }: PanelProps) => {
  return <>{children}</>;
};
