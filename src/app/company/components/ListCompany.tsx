import MainLayout from '@layout/main-layout';
import { PageName } from '@models/enum';
import React from 'react';

const ListCompany = () => {
  return (
    <MainLayout active={PageName.COMPANY}>
      <div>ListCompany</div>
    </MainLayout>
  );
};

export default ListCompany;
