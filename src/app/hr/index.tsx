/** @format */

import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { TabItem } from '../../common/ui/layout/model';
import TabLayout from '../../common/ui/layout/tab-layout';
import AdminContentLayout from '../../common/ui/layout/admin-content-layout';
import { PageName } from '../../models/enum';
import { useTranslation } from 'react-i18next';
import JobListByHR from './components/JobListByHR';
import ResumeList from './components/ResumeListByHR';
import ContentLayout from '@layout/content-layout';

interface Props extends RouteComponentProps<any> {}

const HRDashboard: FC<Props> = (props: Props) => {
  const { t } = useTranslation();

  const HEADERS: Array<TabItem> = [
    { name: t('field.admin.job'), contentId: 'jobs' },
    { name: t('field.admin.cv'), contentId: 'resumes' },
  ];

  return (
    <AdminContentLayout dropDefaultContent title={t('hr.dashboard.title')} activate={PageName.HR_DASHBOARD}>
      <TabLayout tabs={HEADERS}>
        <JobListByHR key={0} id='jobs' />
        <ResumeList key={1} id='resumes' />
      </TabLayout>
    </AdminContentLayout>
  );
};

export default HRDashboard;
