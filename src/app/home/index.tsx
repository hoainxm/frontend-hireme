import { BackToTop } from '@base/button/BackToTop';
import { ScrollSectionNavigation } from '@base/navigation/ScrollSectionNavigation';
import { useDispatch } from 'react-redux';
import { updateSectionDot } from '@layout/slice';
import React, { FC, useEffect } from 'react';
import MainLayout from '../../common/ui/layout/main-layout';
import { PageName, ScopeKey, SectionID } from '../../models/enum';
import { HOME_PAGE_SECTIONS } from './constant';
import { useHistory, useLocation } from 'react-router-dom';

const Home: FC = () => {
  const allSections = HOME_PAGE_SECTIONS.map((s) => ({ sectionId: s.sectionId, text: s.text }));
  const dispatch = useDispatch();

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    let fixedSearch = location.search.replace(/\?(?!token)/g, '&');
    const urlParams = new URLSearchParams(fixedSearch);

    const token = urlParams.get('token');
    const isPremium = urlParams.get('isPremium');
    const isAdmin = urlParams.get('isAdmin');
    const isAuth = urlParams.get('isAuth');

    console.log('Token:', token);
    console.log('isPremium:', isPremium);
    console.log('isAdmin:', isAdmin);
    console.log('isAuth:', isAuth);

    if (token) {
      localStorage.setItem('access_token', token);
      localStorage.setItem(ScopeKey.IS_AUTHENTICATED, isAuth as string);
      localStorage.setItem(ScopeKey.IS_SYSTEM_ADMIN, isAdmin as string);
      localStorage.setItem(ScopeKey.IS_PREMIUM_SECTION, isPremium as string);
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
