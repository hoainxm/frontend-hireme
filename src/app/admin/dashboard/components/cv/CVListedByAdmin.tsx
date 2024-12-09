/** @format */

import React, { FC, useState, useEffect } from 'react';
import { CTable, CTPaging, CTPageSize, CTRow, BlankFrame, Loading, CButton } from '../../../../../common/ui/base';
import { Confirm, Alert } from '../../../../../common/utils/popup';
import { fetchCVsByAdmin, deleteCV } from './api'; // Replace with the actual API functions
import { CV } from './model'; // Replace with the actual CV model
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PageURL } from '../../../../../models/enum';
import { Image } from 'react-bootstrap';
import dayjs from 'dayjs';
import TrashIcon from '../../../../../common/ui/assets/ic/20px/trash-bin.svg';
import { Input } from 'antd';

interface Props {
  id: string;
}

const CVListedByAdmin: FC<Props> = ({ id }) => {
  const { t } = useTranslation();
  const [allCVs, setAllCVs] = useState<CV[]>([]);
  const [filteredCVs, setFilteredCVs] = useState<CV[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const TABLE_HEADER = [t('field.numeric'), t('field.email'), t('field.status'), t('field.last_updated')];

  const fetchAllCVs = () => {
    setIsLoading(true);
    fetchCVsByAdmin(1, 1000)
      .then((res) => {
        const { result } = res.data;
        setAllCVs(result);
        setFilteredCVs(result);
      })
      .catch(() => Alert.error({ title: t('error.title'), content: t('error.fetchFailed') }))
      .finally(() => setIsLoading(false));
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (!value) {
      setFilteredCVs(allCVs);
      return;
    }

    const lowerValue = value.toLowerCase();
    const filtered = allCVs.filter(
      (cv) => cv.email.toLowerCase().includes(lowerValue) || (cv.status && cv.status.toLowerCase().includes(lowerValue))
    );

    setFilteredCVs(filtered);
    setCurrentPage(1);
  };

  const onSearch = (value: string) => {
    handleSearch(value);
  };

  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
  };

  useEffect(() => {
    fetchAllCVs();
  }, []);

  return (
    <div>
      <div className='d-flex justify-content-between mb-3'>
        <Input.Search
          placeholder={t('field.search')}
          onSearch={handleSearch}
          enterButton
          allowClear
          style={{ marginBottom: '16px', maxWidth: '600px' }}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <CTable responsive maxHeight={833}>
        <thead>
          <CTRow header data={TABLE_HEADER} />
        </thead>
        <tbody>
          {filteredCVs.length > 0 ? (
            filteredCVs
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((cv, index) => (
                <CTRow
                  key={cv._id}
                  data={[
                    index + 1 + (currentPage - 1) * pageSize,
                    cv.email || t('field.notSet'),
                    cv.status || t('field.notSet'),
                    dayjs(cv.createdAt).format('HH:mm:ss DD-MM-YYYY'),
                  ]}
                />
              ))
          ) : (
            <BlankFrame className='blank-frame' title={t('field.hint.noData')} />
          )}
        </tbody>
      </CTable>
      {filteredCVs.length > 0 && (
        <div className='d-flex justify-content-between mt-5'>
          <div>
            <CTPageSize className='mt-3' onChange={onChangePageSize} totalData={filteredCVs.length} defaultPageSize={pageSize} />
          </div>
          <div>
            <CTPaging
              className='mt-4'
              currentPage={currentPage}
              totalPage={Math.ceil(filteredCVs.length / pageSize)}
              onGetData={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      )}
      <Loading isOpen={isLoading} />
    </div>
  );
};

export default CVListedByAdmin;
