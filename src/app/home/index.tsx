import { BackToTop } from '@base/button/BackToTop';
import { ScrollSectionNavigation } from '@base/navigation/ScrollSectionNavigation';
import { useDispatch } from 'react-redux';
import { updateSectionDot } from '@layout/slice';
import React, { FC, useEffect } from 'react';
import MainLayout from '../../common/ui/layout/main-layout';
import { PageName, SectionID } from '../../models/enum';
import { HOME_PAGE_SECTIONS } from './constant';
import { useHistory, useLocation } from 'react-router-dom';

const Home: FC = () => {
  const allSections = HOME_PAGE_SECTIONS.map((s) => ({ sectionId: s.sectionId, text: s.text }));
  const dispatch = useDispatch();

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('access_token', token);
      urlParams.delete('token');
      history.replace({
        pathname: location.pathname,
        search: urlParams.toString(),
      });
    }
  }, [location, history]);

  const scrollToTop = () => {
    dispatch(updateSectionDot(SectionID.HOME_BANNER));
  };

  return (
    <MainLayout active={PageName.HOME}>
      <ScrollSectionNavigation sections={allSections} defaultSection={SectionID.HOME_BANNER} />
      {HOME_PAGE_SECTIONS.map((item) => {
        const Component = item.section;
        return <Component key={item.sectionId} sectionId={item.sectionId} />;
      })}
      <BackToTop resetScrollNavigation={scrollToTop} />
    </MainLayout>
  );
};

export default Home;
