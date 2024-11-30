/** @format */

import React, { useEffect, useState } from 'react';
import { getAllCompanies } from '../api';
import { Company } from '../components/Company';
import style from './CompanyList.module.scss';
import { Company as CompanyType } from '../model';
import { CTPaging, Loading } from '../../../common/ui/base';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const CompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const response = await getAllCompanies(currentPage, pageSize);
        const companiesData = (response.data as any).result;
        setCompanies(companiesData);
        setFilteredCompanies(companiesData);
        setTotal((response.data as any).meta.total);
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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    const filtered = companies.filter((company) => company.name.toLowerCase().includes(value));
    setFilteredCompanies(filtered);
  };

  return (
    <div className={style['list-container']}>
      <div className={style['search-container']}>
        <Input
          size='large'
          placeholder='Nhập tên công ty để tìm kiếm...'
          prefix={<SearchOutlined style={{ fontSize: '18px', color: '#888' }} />}
          onChange={handleSearch}
          className={style['search-input']}
        />
      </div>

      {filteredCompanies.length > 0 ? (
        <>
          <div className={style['company-list']}>
            {filteredCompanies.map((company) => (
              <div key={company._id} className={style['company-list__item']}>
                <Company company={company} />
              </div>
            ))}
          </div>

          <div className={style['pagination-container']}>
            <CTPaging
              className='mt-4'
              currentPage={currentPage}
              totalPage={Math.ceil(total / pageSize)}
              onGetData={(page) => handlePageChange(page)}
            />
          </div>
        </>
      ) : (
        <div className={style['empty-container']}>Không có công ty nào phù hợp với từ khóa tìm kiếm.</div>
      )}

      <Loading isOpen={isLoading} />
    </div>
  );
};

export default CompanyList;
