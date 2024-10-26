import React, { FC, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Container } from 'react-bootstrap';
import Loading from '@base/loading';
import { RootState } from 'store/rootReducer';
import { TrialHeader } from './header';
import { TrialSidebar } from './sidebar';
import { configViewSetMeta } from '../../../../common/utils/common';
import { getUserProfile } from '@layout/slice';

interface Props {
  children: ReactNode;
}

export const TrialMainLayout: FC<Props> = (props) => {
  const { children } = props;

  const userInfo = useSelector((state: RootState) => state.main.userInfo);
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      if (!userInfo) dispatch(getUserProfile());
      setLoading(false);
    }, 200);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (window.screen.availWidth < 375) configViewSetMeta('1.0', '0.3');
    else configViewSetMeta('1.0', '1.0');
  }, [window.screen.availWidth]);

  return (
    <>
      {userInfo ? (
        <main id='trial-main' className='position-relative'>
          <TrialHeader />
          <TrialSidebar containerRef={containerRef} />
          <Container ref={containerRef}>{children}</Container>
        </main>
      ) : (
        <Loading isOpen={loading} />
      )}
    </>
  );
};
