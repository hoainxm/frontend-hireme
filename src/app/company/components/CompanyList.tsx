import React, { useEffect, useState } from 'react';
import MainLayout from '@layout/main-layout';
import { PageName } from '@models/enum';
import { getAllCompanies } from '../api';
import { Company } from '../components/Company';
import InfoCompany from './InfoCompany';
import style from './CompanyList.module.scss';
import { Company as CompanyType } from '../model';
import CompanyCard from './CompanyCard';

interface CompanyListProps {
  listCompanies?: CompanyType[];
}

const CompanyList: React.FC<CompanyListProps> = ({ listCompanies = [] }) => {
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getAllCompanies(currentPage, pageSize);
        setCompanies(response.data.result);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    fetchCompanies();
  }, [currentPage]);

  return (
    <div className={style['list-container']}>
      <div className={style['company-list']}>
        {companies.map((company) => (
          <div key={company._id} className={style['company-list__item']}>
            <Company company={company} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyList;
