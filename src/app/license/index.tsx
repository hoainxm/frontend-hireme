import MainLayout from '@layout/main-layout';
import { TabItem } from '@layout/model';
import TabLayout from '@layout/tab-layout';
import { LicenseManagementTabs, PageName } from '@models/enum';
import React, { FC } from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import style from './license.module.scss';
import { FreeLicenseManagement } from './FreeLicenseManagement';
import { Breadcrumb } from '@base/breadcrumb';
import { PaidLicenseManagement } from './PaidLicenseManagement';

interface Props {}

export const LicenseManagement: FC<Props> = (props: Props) => {
  const { t } = useTranslation();

  const HEADERS: Array<TabItem> = [
    { name: LicenseManagementTabs.FREE, contentId: 'ftab' },
    { name: LicenseManagementTabs.PAID, contentId: 'ptab' },
  ];

  return (
    <MainLayout active={PageName.LICENSE_MANAGEMENT} className={style.mainLayout}>
      <Container className={style.container}>
        <Breadcrumb />
        <h4 className={style.title}>{t('user.license.management')}</h4>
        <TabLayout tabs={HEADERS}>
          <FreeLicenseManagement key={0} id='ftab' />
          <PaidLicenseManagement key={1} id='ptab' />
        </TabLayout>
      </Container>
    </MainLayout>
  );
};
