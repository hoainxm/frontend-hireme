/** @format */

import { APICloudFeatureTabs, PageName } from '../../../models/enum';
import React, { FC } from 'react';

import AIPackageManagement from './ai-package';
import AdminContentLayout from '../../../common/ui/layout/admin-content-layout';
import { RouteComponentProps } from 'react-router-dom';
import SysAPIKeyManagement from './ai-api-key';
import { TabItem } from '../../../common/ui/layout/model';
import TabLayout from '../../../common/ui/layout/tab-layout';
import { useTranslation } from 'react-i18next';

interface Props extends RouteComponentProps<any> {}

const AICloudFeatureManagement: FC<Props> = (props: Props) => {
  const { t } = useTranslation();

  const HEADERS: Array<TabItem> = [
    { name: APICloudFeatureTabs.APIKEY, contentId: 'atab' },
    { name: APICloudFeatureTabs.PACKAGE, contentId: 'ptab' },
  ];

  return (
    <AdminContentLayout dropDefaultContent title={t('ai.apikey.management')} activate={PageName.ADMIN_DASHBOARD}>
      <TabLayout tabs={HEADERS}>
        <SysAPIKeyManagement key={0} id='atab' />
        <AIPackageManagement key={1} id={'ptab'} />
      </TabLayout>
    </AdminContentLayout>
  );
};

export default AICloudFeatureManagement;
