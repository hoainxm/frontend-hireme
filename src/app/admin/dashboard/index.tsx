/** @format */

import { AdminManageTabs, APICloudFeatureTabs, PageName } from '../../../models/enum';
import React, { FC } from 'react';
import AIPackageManagement from './ai-package';
import AdminContentLayout from '../../../common/ui/layout/admin-content-layout';
import { RouteComponentProps } from 'react-router-dom';
import SysAPIKeyManagement from './ai-api-key';
import { TabItem } from '../../../common/ui/layout/model';
import TabLayout from '../../../common/ui/layout/tab-layout';
import { useTranslation } from 'react-i18next';
import CompanyForm from './components/company/CompanyForm';
import JobForm from './components/job/JobForm';
import CVForm from './components/cv/CVForm';
import UserForm from './components/user/UserForm';

interface Props extends RouteComponentProps<any> {}

const AICloudFeatureManagement: FC<Props> = (props: Props) => {
  const { t } = useTranslation();

  const HEADERS: Array<TabItem> = [
    { name: APICloudFeatureTabs.APIKEY, contentId: 'atab' },
    { name: APICloudFeatureTabs.PACKAGE, contentId: 'ptab' },
    { name: AdminManageTabs.USER, contentId: 'user' },
  ];

  return (
    <AdminContentLayout dropDefaultContent title={t('ai.apikey.management')} activate={PageName.ADMIN_DASHBOARD}>
      <TabLayout tabs={HEADERS}>
        <CompanyForm key={0} />
        <JobForm key={1} />
        <CVForm key={2} />
        <UserForm key={3} />
        <SysAPIKeyManagement key={0} id='atab' />
        <AIPackageManagement key={1} id={'ptab'} />
      </TabLayout>
    </AdminContentLayout>
  );
};

export default AICloudFeatureManagement;
