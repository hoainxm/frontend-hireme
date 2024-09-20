import React, { FC, useEffect, useState } from 'react';
import style from './navigation.module.scss'
import { TextTooltip } from '@base/tool-tip/TextTooltip'
import { SectionID } from '../../../../models/enum'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@models/rootReducer';
import { updateSectionDot } from '@layout/slice';
import { findActiveSection } from '../../../utils/common';

interface Props {
  sections: Array<{ sectionId: SectionID, text: string }>
  defaultSection: SectionID;
}

export const ScrollSectionNavigation: FC<Props> = (props) => {
  const { sections, defaultSection } = props;
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState<boolean>(false)
  const { sectionId } = useSelector((state: RootState) => state.sectionDot);
  const [selectedSessionId, setSelectedSessionId] = useState<SectionID>(defaultSection);

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  const onClickNavigationItem = (item: SectionID) => {
    dispatch(updateSectionDot(item));
  };

  const handleScroll = () => {
    const activeSection = findActiveSection(sections);
    if (activeSection) {
      setSelectedSessionId(activeSection.sectionId);
      
      if (sectionId !== activeSection.sectionId){
        dispatch(updateSectionDot());
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const sectionElement = document.getElementById(sectionId || "");
    if (sectionElement) {
      sectionElement.id === defaultSection
        ? window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        : sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }, [sectionId]);

  return (
    <nav className={style.scrollNavigation}>
      {sections.map((s, index) => (
        <TextTooltip
          id={s.sectionId}
          visible={isActive}
          tooltipContent={s.text}
          placement="left"
        >
          <button
            key={index}
            className={`${style.dot} ${s.sectionId === selectedSessionId && style.isSelected}`}
            onClick={() => onClickNavigationItem(s.sectionId)}
            onMouseEnter={toggleActive}
            onMouseLeave={toggleActive}
          />
        </TextTooltip>
      ))}
    </nav>
  )
}