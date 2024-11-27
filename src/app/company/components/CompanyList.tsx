/** @format */

import React, { useEffect, useState } from 'react';
import { getAllCompanies } from '../api';
import { Company } from '../components/Company';
import style from './CompanyList.module.scss';
import { Company as CompanyType } from '../model';
import { CTPaging, CTPageSize, Loading } from '../../../common/ui/base';

const CompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const response = await getAllCompanies(currentPage, pageSize);
        setCompanies(response.data.result);
        setTotal(response.data.meta.total);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className={style['list-container']}>
      <div className={style['company-list']}>
        {companies.map((company) => (
          <div key={company._id} className={style['company-list__item']}>
            <Company company={company} />
          </div>
        ))}
      </div>
      <div className={style['pagination-container']}>
        {companies.length > 0 && (
          <>
            {/* <CTPageSize className='mt-3' totalData={total} defaultPageSize={pageSize} onChange={(size) => handlePageSizeChange(size)} /> */}
            <CTPaging
              className='mt-4'
              currentPage={currentPage}
              totalPage={Math.ceil(total / pageSize)}
              onGetData={(page) => handlePageChange(page)}
            />
          </>
        )}
      </div>
      <Loading isOpen={isLoading} />
    </div>
  );
};

export default CompanyList;
