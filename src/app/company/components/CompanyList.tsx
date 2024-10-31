import React, { useEffect, useState } from 'react';
import MainLayout from '@layout/main-layout';
import { PageName } from '@models/enum';
import { getAllCompanies } from '../api';
import { Company } from '../model';
import InfoCompany from './InfoCompany';
import style from './InfoCompany.module.scss';

const CompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getAllCompanies(currentPage, pageSize);
        console.log(response.data);
        setCompanies(response.data.map((company) => company));
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    fetchCompanies();
  }, [currentPage]);

  return (
    <MainLayout active={PageName.COMPANY}>
      <div className={style['company-list']}>
        {companies.map((company) => (
          <div
            key={typeof company._id === 'string' ? company._id : company._id.$oid}
            className={style['company-list__item']}
          >
            <InfoCompany idCompany={typeof company._id === 'string' ? company._id : company._id.$oid} />
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default CompanyList;
