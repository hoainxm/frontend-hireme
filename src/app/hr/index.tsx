/** @format */

import React, { FC, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { TabItem } from '../../common/ui/layout/model';
import TabLayout from '../../common/ui/layout/tab-layout';
import { PageName } from '../../models/enum';
import { useTranslation } from 'react-i18next';
import JobListByHR from './components/JobListByHR';
import ResumeList from './components/ResumeListByHR';
import HRContentLayout from '@layout/hr-content-layout';
import UpgradeAccount from '../../app/upgrade/components/upgradeAccount';
import { RootState, useAppSelector } from '../../store/store';
import { UserProfile } from '../../app/auth/models';

interface Props extends RouteComponentProps<any> {}

const HRDashboard: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const userInfo: UserProfile | null = useAppSelector((state: RootState) => state.user.userProfile);

  const HEADERS: Array<TabItem> = [
    { name: t('field.admin.job'), contentId: 'jobs' },
    { name: t('field.admin.cv'), contentId: 'resumes' },
    { name: t('upgrade'), contentId: 'upgrade' },
  ];

  return (
    <HRContentLayout dropDefaultContent title={t('hr.dashboard.title')} activate={PageName.HR_DASHBOARD}>
      <TabLayout tabs={HEADERS}>
        {userInfo?._id && <JobListByHR key={0} id='jobs' idHr={userInfo?._id} />}
        <ResumeList key={1} id='resumes' />
        {userInfo && <UpgradeAccount key={2} id='upgrade' sectionId={'upgradeSection'} userInfo={userInfo} />}
      </TabLayout>
    </HRContentLayout>
  );
};

export default HRDashboard;
